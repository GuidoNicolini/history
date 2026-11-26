import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { EventoService } from '../../../features/evento/services/evento-service';
import { ConditionService } from '../../../features/condition/services/condition-service';

@Component({
  selector: 'app-progress',
  standalone: false,
  templateUrl: './progress.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './progress.css',
})
export class Progress {
  private eventoService = inject(EventoService);
  private conditionService = inject(ConditionService);

  public isExpanded = false;

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  public tiersProgress = computed(() => {
    const events = Object.values(this.eventoService.state());
    const conditions = this.conditionService.state();

    const tierStats: Record<number, {seen: number, total: number}> = {
      0: { seen: 0, total: 0 },
      1: { seen: 0, total: 0 },
      2: { seen: 0, total: 0 },
      3: { seen: 0, total: 0 },
      4: { seen: 0, total: 0 },
      5: { seen: 0, total: 0 }
    };

    for (const event of events) {
      let eventVipValue: number = 0; // Default to Visitors

      if (event.conditions) {
        for (const condId of event.conditions) {
          const cond = conditions[condId];
          if (cond && cond.type === 'vip') {
            const val = Number(cond.value);
            if (val >= 1 && val <= 5) {
              eventVipValue = val;
              break;
            }
          }
        }
      }

      tierStats[eventVipValue].total++;
      if ((event.numberOfTimesActivated || 0) >= 1) {
        tierStats[eventVipValue].seen++;
      }
    }

    const tiers = [
      { key: 0, name: 'Visitors' },
      { key: 1, name: 'Passerby' },
      { key: 2, name: 'Resident' },
      { key: 3, name: 'Active Citizen' },
      { key: 4, name: 'City Planner' },
      { key: 5, name: 'The Mayor' }
    ];

    return tiers.map(tier => {
      const stats = tierStats[tier.key];
      const percentage = stats.total > 0 ? Math.round((stats.seen / stats.total) * 100) : 0;
      return {
        name: tier.name,
        seen: stats.seen,
        total: stats.total,
        percentage
      };
    });
  });

  public overallProgress = computed(() => {
    const events = Object.values(this.eventoService.state());
    const totalEvents = events.length;
    const totalSeen = events.filter(e => (e.numberOfTimesActivated || 0) >= 1).length;
    const percentage = totalEvents > 0 ? Math.round((totalSeen / totalEvents) * 100) : 0;
    return {
      seen: totalSeen,
      total: totalEvents,
      percentage
    };
  });

  public getTierBarClass(name: string): string {
    switch (name) {
      case 'Visitors': return 'bar-visitors';
      case 'Passerby': return 'bar-passerby';
      case 'Resident': return 'bar-resident';
      case 'Active Citizen': return 'bar-active-citizen';
      case 'City Planner': return 'bar-city-planner';
      case 'The Mayor': return 'bar-the-mayor';
      default: return 'bg-info';
    }
  }
}
