import { Injectable } from '@angular/core';
import {GameCondition} from '../Models/game-condition';
import {HeroService} from '../../features/hero';
import {StoryState} from './story-state';
import {Stats} from '../enums/stats';
import {GameItems} from '../enums/game-items';
import {NpcService} from '../../features/npc/services/npc-service';
import {TimeService} from '../../features/time/services/time-service';

@Injectable({
  providedIn: 'root',
})
export class ConditionEvaluator {

  constructor(
    private heroService: HeroService,
    private storyState: StoryState,
    private npcService: NpcService,
    private timeService: TimeService
  ) {}

  // Evalúa una lista entera de condiciones (todas deben cumplirse, un AND lógico)
  public checkAll(conditions: GameCondition[]): boolean {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(c => this.evaluate(c));
  }

  // El motor que interpreta el JSON
  private evaluate(condition: GameCondition): boolean {
    let currentValue: any;

    // 1. Obtener el valor actual dependiendo de qué estamos buscando
    switch (condition.type) {
      case 'flag':
        currentValue = this.storyState.getFlag(condition.target);
        break;
      case 'stat-hero':
        currentValue = this.heroService.getStat(condition.target as unknown as Stats);
        break;
      case 'item':
        currentValue = this.heroService.getItemQuantity(condition.target as unknown as GameItems);
        break;

        // en el json recordar separar el target con ':' donde primero ponemos el id y luego el nombre de la stat
      case 'stat-npc':
        const [idString, statName] = condition.target.split(':');
        currentValue = this.npcService.getStat(parseInt(idString, 10), statName as unknown as Stats);
        break;

      case 'time':
        currentValue = this.timeService.state().hour;
        break;

      case 'day':
        currentValue = this.timeService.state().day;
        break;


    }

    // 2. Aplicar el operador matemático
    switch (condition.operator) {
      case '==': return currentValue === condition.value;
      case '!=': return currentValue !== condition.value;
      case '>':  return currentValue > condition.value;
      case '<':  return currentValue < condition.value;
      case '>=': return currentValue >= condition.value;
      case '<=': return currentValue <= condition.value;


      // si el operador utiliza between se debe poner el minimo primero y el maximo despues separado por ':'
      case 'between': {
        const [minStr, maxStr] = String(condition.value).split(':');
        return currentValue >= parseInt(minStr, 10) && currentValue <= parseInt(maxStr, 10);
      }
      default: return false;
    }
  }
}
