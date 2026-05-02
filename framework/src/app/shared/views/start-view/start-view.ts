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

  protected loadGame(event?: Event) {

    // Si la función es llamada desde un botón estándar: <button (click)="loadGame()">, abrimos el selector de archivos
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // Ajusta la extensión de archivo si es necesario
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.saveLoadService.loadStateFromFile(target.files[0]);
        console.log("forma 2")
        setTimeout(() => {
          this.router.navigate(['/location/1000']);
        }, 2000);
      }
    };
    input.click();
  }

  protected continueGame() {
    this.saveLoadService.loadStateFromLocalStorage()
    setTimeout(() => {
      this.router.navigate(['/location/1000']);
    }, 2000);
  }
}
