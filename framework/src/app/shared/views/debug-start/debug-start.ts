import { Component } from '@angular/core';
import {Initializer} from '../../services/initializer';
import {Router} from '@angular/router';

@Component({
  selector: 'app-debug-start',
  standalone: false,
  templateUrl: './debug-start.html',
  styleUrl: './debug-start.css',
})
export class DebugStart {

  constructor(private router: Router) {
  }
  initilizer = new Initializer();

  protected newGame() {
    this.initilizer.initializeAllData();


    //this.router.navigate(['/location/100']);
    setTimeout(() => {
      this.router.navigate(['/evento/history0001']);
    }, 2000);

  }

  protected loadGame() {

  }
}
