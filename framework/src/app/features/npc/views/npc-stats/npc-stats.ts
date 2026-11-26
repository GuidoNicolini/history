import { Component, Input, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { NpcService } from '../../services/npc-service';
import { CharacterID } from '../../../../shared/enums/character-id';

@Component({
  selector: 'app-npc-stats',
  standalone: false,
  templateUrl: './npc-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  npcRelationsArray = computed(() => {
    const relations = this.npcService.stateRelation();
    const id = this.npcId as number;

    return Object.values(relations)
      .filter(rel => rel.id1 === id || rel.id2 === id)
      .map(rel => {
        const otherId = rel.id1 === id ? rel.id2 : rel.id1;
        return { key: otherId, value: rel.value };
      });
  });
}
