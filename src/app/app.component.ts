import {Component} from '@angular/core';
import {StopWatch} from './stop-watch/stop-watch.component';

@Component({
  selector: 'app-root',
  imports: [StopWatch],
  templateUrl: './app.component.html'
})
export class AppComponent {

}
