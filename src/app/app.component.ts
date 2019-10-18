import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private counterService: CounterService){}

  title = 'counters';

  reset() {
    this.initialValue = [0,0,0];
  }
  
}
