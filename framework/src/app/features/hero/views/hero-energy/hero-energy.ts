import {Component, computed, inject} from '@angular/core';
import {HeroService} from '../../services/hero-service';
import {Stats} from '../../../../shared/enums/stats';

@Component({
  selector: 'app-hero-energy',
  standalone: false,
  templateUrl: './hero-energy.html',
  styleUrl: './hero-energy.css',
})
export class HeroEnergy {
  private heroService = inject(HeroService)

  public energy = computed(() => {
    const state = this.heroService.state();
    const energy = state.stats?.[Stats.ENERGY] || 0;

    return energy;

  })

}
