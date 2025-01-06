import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {toZonedTime } from 'date-fns-tz';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  /** track of the time in seconds */
  private counter: number = 0;
  /** flag that tracks if the timer is paused */
  private isPaused: boolean = true;
  /** used to detect user click interactions for potential double-click detection */
  private waitClickSubject: Subject<void> = new Subject<void>();
  /** stores the current timer value */
  private userTimer$: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.utcZonedTimeFromNumber(0));
  /** set timer to 0 time zone */
  private utcZonedTimeFromNumber(time: number): Date  {
    return  toZonedTime(new Date(time), 'UTC');
  }

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
      this.startTimer$();
    }
  }

  public resetTimer(): void {
    this.counter = 0;
    this.userTimer$.next(this.utcZonedTimeFromNumber(0));
    this.isPaused = true;
  }

  /** Handles user click interactions for detecting double-clicks */
  public handleWaitClick$():Observable<void> {
    let lastClickTime = 0;

    return this.waitClickSubject.pipe(tap(() => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime <= 300) {
        this.isPaused = true;
      }
      lastClickTime = currentTime;
    }));
  }

  public emitWaitClick(): void {
    this.waitClickSubject.next();
  }

  public startTimer$():Observable<number> {
    return timer(0, 1000).pipe(
      tap(() => {
        if (!this.isPaused) {
          this.counter++;
          this.userTimer$.next(this.utcZonedTimeFromNumber(this.counter * 1000));
        }
      })
    );
  }
}
