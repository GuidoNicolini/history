import {Component, computed, Inject, ChangeDetectionStrategy} from '@angular/core';
import {HeroService} from '../../services/hero-service';

@Component({
  selector: 'app-hero-stats',
  standalone: false,
  templateUrl: './hero-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero-stats.css',
})
export class HeroStats {

  constructor(public heroService: HeroService) {}


  // Transformamos el Record/Diccionario en un array iterable para el HTML
  // Esto se actualiza automáticamente si cambia algún stat en el HeroService
  public statsList = computed(() => {
    const stats = this.heroService.state().stats;
    return Object.entries(stats).map(([name, level]) => ({
      name,
      level
    }));
  });


}
