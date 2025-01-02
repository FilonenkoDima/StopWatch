import {Component, input, OnInit, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, interval, map, Observable, Subject, switchMap, tap, timer} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public userTimer$ = new BehaviorSubject<Date>(new Date(0));
  public isPause: boolean = false;  // Use a boolean flag to control pause

  private counter: number = 0;

  // Observable to track the "Wait" button clicks
  private waitClickSubject = new Subject<void>();
  private lastClickTime: number = 0;

  ngOnInit() {
    // Subscribe to wait click events
    this.waitClickSubject.pipe(
      debounceTime(300), // 300ms debounce time between clicks
      tap(() => this.togglePauseOnWaitClick())
    ).subscribe();

    this.appTimer();
  }

  appTimer() {
    // Only start the timer if not paused
    if (!this.isPause) {
      timer(0, 1000).pipe(
        tap(() => {
          if (!this.isPause) {
            this.counter++;
          }
        }),
        map(() => this.userTimer$.next(new Date(this.counter * 1000)))
      ).subscribe();
    }
  }

  getCounter() {
    return this.counter;
  }

  // Toggle pause on button click
  onToggleTimerMode() {
    this.isPause = !this.isPause;
  }

  onReset() {
    this.counter = 0;
  }

  // Wait button logic - Detect double click
  onWaitClick() {
    const currentTime = Date.now();
    if (currentTime - this.lastClickTime <= 300) {
      this.waitClickSubject.next(); // Trigger double-click action
    }
    this.lastClickTime = currentTime; // Update the last click time
  }

  togglePauseOnWaitClick() {
    this.isPause = true; // Toggle the pause state on double-click
  }
}
