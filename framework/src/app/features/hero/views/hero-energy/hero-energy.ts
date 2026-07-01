import {Component, computed, inject, ChangeDetectionStrategy} from '@angular/core';
import {HeroService} from '../../services/hero-service';
import {Stats} from '../../../../shared/enums/stats';

@Component({
  selector: 'app-hero-energy',
  standalone: false,
  templateUrl: './hero-energy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero-energy.css',
})
export class HeroEnergy {
  private heroService = inject(HeroService)

  public energy = computed(() => {
    const state = this.heroService.state();
    return state.stats?.[Stats.ENERGY] || 0;
  });

  public maxEnergy = this.heroService.maxEnergy;

  public energyPercentage = computed(() => {
    const energy = this.energy();
    const max = this.maxEnergy();
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (energy / max) * 100));
  });

}
