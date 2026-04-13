import { Injectable } from '@angular/core';
import { EventoEffect } from '../models/evento-effect';
import { HeroService } from '../../hero';
import { NpcService } from '../../npc/services/npc-service';
import { TimeService } from '../../time/services/time-service';
import { Stats } from '../../../shared/enums/stats';
import { GameItems } from '../../../shared/enums/game-items';
import { CharacterID } from '../../../shared/enums/character-id';

@Injectable({
  providedIn: 'root',
})
export class EffectEvaluator {

  constructor(
    private heroService: HeroService,
    private npcService: NpcService,
    private timeService: TimeService
  ) {}

  public applyAll(effects: EventoEffect[]): void {
    if (!effects || effects.length === 0) return;
    for (const effect of effects) {
      this.applyEffect(effect);
    }
  }

  private applyEffect(effect: EventoEffect): void {
    const isPlus = effect.operator === 'plus';

    switch (effect.type) {
      case 'hero-stat': {
        const amount = isPlus ? Number(effect.value) : -Number(effect.value);
        this.heroService.modifyRandomStat(effect.target as unknown as Stats, amount);
        break;
      }
      case 'npc-stat': {
        // En value se recibe el id del npc y el valor a modificar separado con ':'
        const [idString, valueString] = String(effect.value).split(':');
        const npcId = parseInt(idString, 10) as CharacterID;
        const amount = isPlus ? Number(valueString) : -Number(valueString);
        this.npcService.modifyRandomStat(npcId, effect.target as unknown as Stats, amount);
        break;
      }
      case 'item': {
        const amount = Number(effect.value);
        if (isPlus) {
          this.heroService.addItem(effect.target as unknown as GameItems, amount);
        } else {
          this.heroService.removeItem(effect.target as unknown as GameItems, amount);
        }
        break;
      }
      case 'relation': {
        // En value se reciben dos ids de characters separados por ':'
        // El primer id es el npc principal y el segundo id es el secundario
        const [principalStr, secondaryStr] = String(effect.value).split(':');
        const npcPrincipalId = parseInt(principalStr, 10) as CharacterID;
        const npcSecondaryId = parseInt(secondaryStr, 10) as CharacterID;
        const amount = isPlus ? 1 : -1;
        this.npcService.modifyAttraction(npcPrincipalId, npcSecondaryId, amount);
        break;
      }
      case 'hour': {
        const amount = Number(effect.value);
        if (isPlus) {
          this.timeService.advanceHours(amount);
        } else {
          // No implemented for minus because it implies time traveling backwards which TimeService doesn't support
        }
        break;
      }
      case 'minute': {
        const amount = Number(effect.value);
        if (isPlus) {
          this.timeService.advanceMinutes(amount);
        } else {
          // No implemented for minus because it implies time traveling backwards which TimeService doesn't support
        }
        break;
      }
      case 'energy': {
        const amount = isPlus ? Number(effect.value) : -Number(effect.value);
        this.heroService.modifyEnergy(amount);
        break;
      }
    }
  }
}
