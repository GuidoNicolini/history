import { Injectable } from '@angular/core';
import {GameCondition} from '../models/game-condition';
import {HeroService} from '../../hero';
import {StoryState} from '../../../shared/services/story-state';
import {Stats} from '../../../shared/enums/stats';
import {GameItems} from '../../../shared/enums/game-items';
import {NpcService} from '../../npc/services/npc-service';
import {TimeService} from '../../time/services/time-service';
import {EventoService} from '../../evento/services/evento-service';
import {VipService} from '../../../shared/services/vip-service';
import {CharacterID} from '../../../shared/enums/character-id';

@Injectable({
  providedIn: 'root',
})
export class ConditionEvaluator {

  constructor(
    private heroService: HeroService,
    private storyState: StoryState,
    private npcService: NpcService,
    private timeService: TimeService,
    private eventoService: EventoService,
    private vipService: VipService
  ) {}

  // Evalúa una lista entera de condiciones (todas deben cumplirse, un AND lógico)
  public checkAll(conditions: GameCondition[], contextId?: string): boolean {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(c => this.evaluate(c, contextId));
  }

  // El motor que interpreta el JSON
  private evaluate(condition: GameCondition, contextId?: string): boolean {
    let currentValue: any;

    // 1. Obtener el valor actual dependiendo de qué estamos buscando
    switch (condition.type) {
      case 'flag':
        currentValue = this.storyState.getFlag(condition.target!);
        // Si la bandera no está definida, por defecto es false
        if (currentValue === undefined) {
          currentValue = false;
        }
        break;
      case 'stat-hero':
        currentValue = this.heroService.getStat(condition.target as unknown as Stats);
        break;
      case 'item':
        currentValue = this.heroService.getItemQuantity(condition.target as unknown as GameItems);
        break;

        // en el json recordar separar el target con ':' donde primero ponemos el id y luego el nombre de la stat
      case 'stat-npc':
        const [idString, statName] = condition.target!.split(':');
        currentValue = this.npcService.getStat(parseInt(idString, 10), statName as unknown as Stats);
        break;

      case 'relation': {
        const [id1Str, id2Str] = condition.target!.split(':');
        const relation = this.npcService.getRelationByCharacters(parseInt(id1Str, 10), parseInt(id2Str, 10));
        currentValue = relation ? relation.value : 0;
        break;
      }

      case 'time':
        currentValue = this.timeService.state().hour;
        break;

      case 'day':
        currentValue = this.timeService.state().date;
        break;

      case 'vip': {
        // En este caso el target estará vacío y el value será el nivel de VIP.
        // Como 'evaluate' normalmente compara currentValue con condition.value,
        // devolvemos directamente el estado (boolean) si no hay un operador para verificar.
        // Para mantener compatibilidad con la estructura actual:
        currentValue = this.vipService.getVipStatus(condition.value as number);
        return currentValue
        break;
      }

      case 'cd': {
        const eventoId = condition.target || contextId;
        if (!eventoId) return false;

        const evento = this.eventoService.getEventoById(eventoId);
        if (!evento) return false;

        // Si nunca se ha activado o no tiene lastDayActivated, permitimos activarlo (ya que no hay cooldown que comprobar)
        if (evento.lastDayActivated === undefined || evento.lastDayActivated === null || evento.lastDayActivated === 0) return true;

        const currentDay = this.timeService.state().date;
        const cooldown = evento.cooldownDuration || 0;

        return (currentDay - evento.lastDayActivated) >= cooldown;
      }

      case 'imhere': {

        if (!contextId) return false;

        const npcId = parseInt(String(condition.value), 10) as any;
        const eventLocation = this.eventoService.getEventoLocation(contextId);


        if (eventLocation === undefined) return false;

        const npcLocation = this.npcService.getCurrentLocation(npcId);

        return npcLocation == eventLocation;
      }

      case 'random': {
        const probability = (condition.value as number) || 0;
        return (Math.random() * 100) < probability;
      }

      case 'activation': {
        const eventoId = condition.target;
        if (!eventoId) {
          currentValue = 0;
        } else {
          const evento = this.eventoService.getEventoById(eventoId);
          currentValue = evento ? evento.numberOfTimesActivated : 0;
        }
        break;
      }

      case 'auto-activation': {
        if (!contextId) {
          return false
        } else {
          const evento = this.eventoService.getEventoById(contextId);
          currentValue = evento ? evento.numberOfTimesActivated : 0;
        }
        break;
      }

    }


    // Si la condición de 'cd' hace return directamente, solo procesamos el operador para los otros casos
    if (!condition.operator) return true;

    // Normalizar tipos para evitar que un string 'false' comparado con el booleano false devuelva false
    let expectedValue = condition.value;
    if (expectedValue === 'true') expectedValue = true;
    if (expectedValue === 'false') expectedValue = false;

    if (currentValue === 'true') currentValue = true;
    if (currentValue === 'false') currentValue = false;

    // 2. Aplicar el operador matemático
    switch (condition.operator) {
      case '==': return currentValue === expectedValue;
      case '!=': return currentValue !== expectedValue;
      case '>':  return currentValue > expectedValue;
      case '<':  return currentValue < expectedValue;
      case '>=': return currentValue >= expectedValue;
      case '<=': return currentValue <= expectedValue;


      // si el operador utiliza between se debe poner el minimo primero y el maximo despues separado por ':'
      case 'between': {
        const [minStr, maxStr] = String(expectedValue).split(':');
        return currentValue >= parseInt(minStr, 10) && currentValue <= parseInt(maxStr, 10);
      }

      // 'between-time' contempla rangos horarios que pueden cruzar la medianoche (ej: 22:06)
      case 'between-time': {
        const [minStr, maxStr] = String(expectedValue).split(':');
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);

        if (min <= max) {
          // Rango normal en el mismo día (ej: 07 a 22)
          return currentValue >= min && currentValue <= max;
        } else {
          // Rango que cruza la medianoche (ej: 22 a 06)
          return currentValue >= min || currentValue <= max;
        }
      }

      default: return false;
    }
  }
}
