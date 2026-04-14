import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {Initializer} from '../../services/initializer';
import {SaveLoadService} from '../../services/save-load-service';

@Component({
  selector: 'app-start-view',
  standalone: false,
  templateUrl: './start-view.html',
  styleUrl: './start-view.css',
})
export class StartView {
  constructor(private router: Router,private saveLoadService: SaveLoadService) {
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
    this.saveLoadService.loadStateFromLocalStorage()
    this.router.navigate(['/location/1000']);
  }
}
