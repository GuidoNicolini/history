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

  // Propiedad para controlar la visualización de la alerta de carga
  isLoading = false;

  protected newGame() {
    this.isLoading = true;
    this.initilizer.initializeAllData().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/evento/history0001']);
      },
      error: (err) => {
        console.error('Error starting new game:', err);
        this.isLoading = false;
      }
    });
  }

  protected loadGame(event?: Event) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.isLoading = true;
        const file = target.files[0];

        // Inicializamos los datos por defecto primero para tener la estructura de las nuevas actualizaciones
        this.initilizer.initializeAllData().subscribe({
          next: () => {
            // Luego cargamos la partida, sobreescribiendo el estado inicial con el guardado del usuario
            this.saveLoadService.loadStateFromFile(file)
              .then(() => {
                this.isLoading = false;
                this.router.navigate(['/location/1000']);
              })
              .catch((err) => {
                console.error('Error loading game state from file:', err);
                this.isLoading = false;
              });
          },
          error: (err) => {
            console.error('Error initializing data for loading game:', err);
            this.isLoading = false;
          }
        });
      }
    };
    input.click();
  }

  protected continueGame() {
    this.isLoading = true;
    // Inicializamos primero para tener la estructura de datos actualizada
    this.initilizer.initializeAllData().subscribe({
      next: () => {
        this.saveLoadService.loadStateFromLocalStorage();
        this.isLoading = false;
        this.router.navigate(['/location/1000']);
      },
      error: (err) => {
        console.error('Error initializing data for continuing game:', err);
        this.isLoading = false;
      }
    });
  }
}
