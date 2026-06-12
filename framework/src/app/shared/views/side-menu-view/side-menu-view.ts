import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { VipService } from '../../services/vip-service';

@Component({
  selector: 'app-side-menu-view',
  standalone: false,
  templateUrl: './side-menu-view.html',
  styleUrl: './side-menu-view.css',
})
export class SideMenuVIew implements OnInit, OnDestroy {
  showPatreonImage: boolean = false;
  vipLevel: number = 0;
  vipName: string = '';
  private intervalId: any;
  private timeoutId: any;
  private vipSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private vipService: VipService
  ) {}

  ngOnInit(): void {
    const fifteenMinutes = 10 * 60 * 1000; // 10 minutos en milisegundos
    const thirtySeconds = 30 * 1000;       // 30 segundos en milisegundos

    // Configurar el intervalo para que se ejecute cada 15 minutos
    this.intervalId = setInterval(() => {
      this.showPatreonBanner(thirtySeconds);
    }, fifteenMinutes);

    // Opcional: Llama a la función aquí si quieres que también se muestre la primera vez
    // al cargar la aplicación sin tener que esperar los primeros 15 minutos.
    this.showPatreonBanner(thirtySeconds);

    // Suscribirse a cambios de VIP
    this.vipSubscription = this.vipService.vipChanges$.subscribe(() => {
      this.updateVipInfo();
    });
  }

  private updateVipInfo(): void {
    let activeLevel = 0;
    for (let i = 5; i >= 1; i--) {
      if (this.vipService.getVipStatus(i)) {
        activeLevel = i;
        break;
      }
    }
    this.vipLevel = activeLevel;

    const names = [
      '',
      'Passerby',
      'Resident',
      'Active Citizen',
      'City Planner',
      'The Mayor'
    ];
    this.vipName = names[activeLevel] || '';
    this.cdr.detectChanges(); // Asegura que la vista se actualice
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
    if (this.vipSubscription) {
      this.vipSubscription.unsubscribe();
    }
  }
}
