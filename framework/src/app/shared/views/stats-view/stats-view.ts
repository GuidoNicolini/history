import { Component, computed, inject } from '@angular/core';
import { HeroService } from '../../../features/hero/services/hero-service';
import { Stats } from '../../enums/stats';

@Component({
  selector: 'app-stats-view',
  standalone: false,
  templateUrl: './stats-view.html',
  styleUrl: './stats-view.css',
})
export class StatsView {
  private heroService = inject(HeroService);

  public isExpanded = false;

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  public statsData = computed(() => {
    const stats = this.heroService.state().stats;
    if (!stats) return [];

    return [
      { name: 'Strength', icon: '💪', isEmoji: true, bgClass: 'card-strength', value: stats[Stats.STRENGTH] || 0 },
      { name: 'Agility', icon: 'bi-wind', isEmoji: false, bgClass: 'card-agility', value: stats[Stats.AGILITY] || 0 },
      { name: 'Intelligence', icon: 'bi-book-fill', isEmoji: false, bgClass: 'card-intelligence', value: stats[Stats.INTELLIGENCE] || 0 },
      { name: 'Charisma', icon: 'bi-chat-heart-fill', isEmoji: false, bgClass: 'card-charisma', value: stats[Stats.CHARISMA] || 0 }
    ];
  });
}
