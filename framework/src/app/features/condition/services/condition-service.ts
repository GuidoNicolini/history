import {Injectable, signal} from '@angular/core';
import {GameCondition} from '../models/game-condition';

@Injectable({
  providedIn: 'root',
})
export class ConditionService {
  //el primer number es para el id
  public state = signal<Record<number,GameCondition>>({})

  constructor() {}

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
}
