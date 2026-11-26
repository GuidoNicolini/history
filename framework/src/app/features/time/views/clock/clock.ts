import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { TimeService } from '../../services/time-service';

@Component({
  selector: 'app-clock',
  standalone: false,
  templateUrl: './clock.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './clock.css',
})
export class Clock {
  private timeService = inject(TimeService);

  public formattedTime = computed(() => {
    const state = this.timeService.state();
    const h = (state.hour || 0).toString().padStart(2, '0');
    const m = (state.minutes || 0).toString().padStart(2, '0');
    return `${h}:${m}`;
  });
}
