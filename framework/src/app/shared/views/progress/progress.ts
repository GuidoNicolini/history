import { Component, computed, inject } from '@angular/core';
import { EventoService } from '../../../features/evento/services/evento-service';
import { ConditionService } from '../../../features/condition/services/condition-service';

@Component({
  selector: 'app-progress',
  standalone: false,
  templateUrl: './progress.html',
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

    const tierStats = {
      1: { seen: 0, total: 0 },
      2: { seen: 0, total: 0 },
      3: { seen: 0, total: 0 },
      4: { seen: 0, total: 0 },
      6: { seen: 0, total: 0 }
    };

    for (const event of events) {
      if (!event.conditions) continue;
      
      // Encontrar si este evento tiene una condición VIP en los tiers definidos
      let eventVipValue: number | null = null;
      for (const condId of event.conditions) {
        const cond = conditions[condId];
        if (cond && cond.type === 'vip') {
          const val = Number(cond.value);
          if (val === 1 || val === 2 || val === 3 || val === 4 || val === 6) {
            eventVipValue = val;
            break;
          }
        }
      }

      if (eventVipValue !== null) {
        tierStats[eventVipValue as 1 | 2 | 3 | 4 | 6].total++;
        if ((event.numberOfTimesActivated || 0) >= 1) {
          tierStats[eventVipValue as 1 | 2 | 3 | 4 | 6].seen++;
        }
      }
    }

    const tiers = [
      { key: 1, name: 'Passerby' },
      { key: 2, name: 'Resident' },
      { key: 3, name: 'Active Citizen' },
      { key: 4, name: 'City Planner' },
      { key: 6, name: 'The Mayor' }
    ];

    const mappedTiers = tiers.map(tier => {
      const stats = tierStats[tier.key as 1 | 2 | 3 | 4 | 6];
      const percentage = stats.total > 0 ? Math.round((stats.seen / stats.total) * 100) : 0;
      return {
        name: tier.name,
        seen: stats.seen,
        total: stats.total,
        percentage
      };
    });

    const overall = this.overallProgress();
    const general = {
      name: 'General',
      seen: overall.seen,
      total: overall.total,
      percentage: overall.percentage
    };

    return [general, ...mappedTiers];
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
      case 'General': return 'bar-general';
      case 'Passerby': return 'bar-passerby';
      case 'Resident': return 'bar-resident';
      case 'Active Citizen': return 'bar-active-citizen';
      case 'City Planner': return 'bar-city-planner';
      case 'The Mayor': return 'bar-the-mayor';
      default: return 'bg-info';
    }
  }
}
