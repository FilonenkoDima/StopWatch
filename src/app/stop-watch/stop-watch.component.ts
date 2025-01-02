import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';

import { TimerService } from './timer.service';
import {Observable} from 'rxjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  imports: [AsyncPipe, DatePipe, NgbModule],
})
export class StopWatch implements OnInit {
  private timerService: TimerService = inject(TimerService);

  public ngOnInit(): void {
    this.timerService.handleWaitClick(() => this.timerService.togglePause());
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
}
