import { Component, Input, computed, inject } from '@angular/core';
import { NpcService } from '../../services/npc-service';
import { CharacterID } from '../../../../shared/enums/character-id';

@Component({
  selector: 'app-npc-stats',
  standalone: false,
  templateUrl: './npc-stats.html',
  styleUrl: './npc-stats.css'
})
export class NpcStats {
  @Input({ required: true }) npcId!: CharacterID;

  private npcService = inject(NpcService);

  npc = computed(() => {
    return this.npcService.state()[this.npcId as number];
  });

  // Convert dictionaries into arrays for the template @for iteration
  // Using signals to maintain reactivity
  npcStatsArray = computed(() => {
    const data = this.npc();
    if (!data || !data.stats) return [];
    return Object.entries(data.stats).map(([key, value]) => ({ key, value }));
  });

  npcAttractionsArray = computed(() => {
    const data = this.npc();
    if (!data || !data.attractions) return [];
    return Object.entries(data.attractions).map(([key, value]) => ({ key, value }));
  });
}
