import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-side-menu-view',
  standalone: false,
  templateUrl: './side-menu-view.html',
  styleUrl: './side-menu-view.css',
})
export class SideMenuVIew implements OnInit, OnDestroy {
  showPatreonImage: boolean = false;
  private intervalId: any;
  private timeoutId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutos en milisegundos
    const thirtySeconds = 30 * 1000;       // 30 segundos en milisegundos

    // Configurar el intervalo para que se ejecute cada 15 minutos
    this.intervalId = setInterval(() => {
      this.showPatreonBanner(thirtySeconds);
    }, fifteenMinutes);

    // Opcional: Llama a la función aquí si quieres que también se muestre la primera vez
    // al cargar la aplicación sin tener que esperar los primeros 15 minutos.
    // this.showPatreonBanner(thirtySeconds);
  }

  private showPatreonBanner(hideAfterMs: number) {
    this.showPatreonImage = true;
    this.cdr.detectChanges(); // Asegura que la vista se actualice

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Configurar el timeout para ocultarlo después de los segundos indicados
    this.timeoutId = setTimeout(() => {
      this.showPatreonImage = false;
      this.cdr.detectChanges(); // Asegura que la vista se actualice
    }, hideAfterMs);
  }

  ngOnDestroy(): void {
    // Limpiar los timers cuando el componente se destruya para evitar fugas de memoria
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
