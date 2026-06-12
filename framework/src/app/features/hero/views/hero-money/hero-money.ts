import {Component, computed, inject} from '@angular/core';
import {HeroService} from '../../services/hero-service';
import {Stats} from '../../../../shared/enums/stats';
import {GameItems} from '../../../../shared/enums/game-items';

@Component({
  selector: 'app-hero-money',
  standalone: false,
  templateUrl: './hero-money.html',
  styleUrl: './hero-money.css',
})
export class HeroMoney {
  private heroService = inject(HeroService);

  public money = computed(() => {
    const state = this.heroService.state();
    return state.inventory?.[GameItems.MONEY] || 0;
  });

  public formattedMoney = computed(() => {
    const value = this.money();
    return new Intl.NumberFormat('en-US').format(value);
  });


}
