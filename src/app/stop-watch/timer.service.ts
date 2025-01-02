import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer, Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  /** track of the time in seconds */
  private counter: number = 0;
  /** flag that tracks if the timer is paused */
  private isPaused: boolean = true;
  private timerSubscription: Subscription | null = null;
  /** used to detect user click interactions for potential double-click detection */
  private waitClickSubject: Subject<void> = new Subject<void>();
  /** save click subscription */
  private clickSubjectSubscription: any = null;
  /** stores the current timer value */
  private userTimer$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(0));



  public get getUserTimer$(): Observable<Date> {
    return this.userTimer$ as Observable<Date>;
  }

  /** Returns the current paused state of the timer */
  public get getIsPaused(): boolean {
    return this.isPaused;
  }

  /** indicating if the timer has started */
  public get getIsTimerStarted(): boolean {
    return this.counter > 0;
  }

  /** Toggles the paused state of the timer.
   * If the timer is not running and the user unpauses it, the
   * startTimer() method is invoked to start the timer. */
  public togglePause(): void {
    this.isPaused = !this.isPaused;

    if(!this.counter && !this.isPaused) {
      this.startTimer();
    }
  }

  public resetTimer(): void {
    this.counter = 0;
    this.userTimer$.next(new Date(0));
    this.isPaused = true;
    this.stopTimer();
  }

  /** Handles user click interactions for detecting double-clicks */
  public handleWaitClick(onDoubleClick: () => void): void {
    let lastClickTime = 0;

    this.clickSubjectSubscription = this.waitClickSubject.subscribe(() => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime <= 300) {
        onDoubleClick();

        this.isPaused = true;
      }
      lastClickTime = currentTime;
    });

  }

  public emitWaitClick(): void {
    this.waitClickSubject.next();

  }

  private startTimer(): void {
    this.isPaused = false;
    this.timerSubscription = timer(0, 1000).pipe(
      tap(() => {
        if (!this.isPaused) {
          this.counter++;
          this.userTimer$.next(new Date(this.counter * 1000));
        }
      })
    ).subscribe();
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.clickSubjectSubscription) {
      this.clickSubjectSubscription.unsubscribe();
    }
  }
}
