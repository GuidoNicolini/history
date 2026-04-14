import {Injectable, signal} from '@angular/core';
import {GameCondition} from '../models/game-condition';
import { ISaveable } from '../../../shared/interfaces/saveable.interface';
import { SaveLoadService } from '../../../shared/services/save-load-service';

@Injectable({
  providedIn: 'root',
})
export class ConditionService implements ISaveable {
  public saveKey = 'conditions';
  //el primer number es para el id
  public state = signal<Record<number,GameCondition>>({})

  constructor(private saveLoadService: SaveLoadService) {
    this.saveLoadService.register(this);
  }

  /**
   * Inicializa el estado con una lista de condiciones.
   */
  public initializeConditions(conditions: GameCondition[]): void {
    const newState: Record<number, GameCondition> = {};
    for (const condition of conditions) {
      // Se asume que GameCondition tiene una propiedad id
      newState[condition.id] = condition;
    }
    this.state.set(newState);
  }

  /**
   * Obtiene una condición por su ID.
   */
  public getConditionById(id: number): GameCondition | undefined {
    return this.state()[id];
  }

  /**
   * Busca múltiples condiciones por sus IDs.
   */
  public findConditions(conditionsId: number[]): GameCondition[] {
    const currentState = this.state();
    return conditionsId
      .map(id => currentState[id])
      .filter((condition): condition is GameCondition => condition !== undefined);
  }

  /**
   * Exporta el estado actual de las condiciones.
   */
  public exportState(): Record<number, GameCondition> {
    return this.state();
  }

  /**
   * Importa un estado previamente exportado.
   */
  public importState(newState: Record<number, GameCondition>): void {
    this.state.set(newState);
  }
}
