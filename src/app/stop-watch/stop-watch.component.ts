import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { TimerService } from './timer.service';

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  imports: [AsyncPipe, DatePipe, NgbModule],
})
export class StopWatch implements OnInit, OnDestroy {
  private timerService: TimerService = inject(TimerService);
  private timer$!: Subscription;
  private doubleClick$!: Subscription;

  public ngOnInit(): void {
    this.timer$ = this.timerService.startTimer().subscribe();
    this.doubleClick$ = this.timerService.handleWaitClick().subscribe();
  }

  public get userTimer(): Observable<Date> {
    return this.timerService.getUserTimer$;
  }

  public get isTimerPaused(): boolean {
    return this.timerService.getIsPaused;
  }

  public get isTimerStarted(): boolean {
    return this.timerService.getIsTimerStarted;
  }

  public onToggleTimerMode(): void {
      this.timerService.togglePause();
  }

  public onReset(): void {
    this.timerService.resetTimer();
  }

  public onWaitClick(): void {
    this.timerService.emitWaitClick();
  }

  ngOnDestroy() {
    this.timer$.unsubscribe();
    this.doubleClick$.unsubscribe();
  }
}
