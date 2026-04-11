import {Injectable, signal} from '@angular/core';
import {EventoEffect} from '../models/evento-effect';

@Injectable({
  providedIn: 'root',
})
export class EventoEffectService {
  public state = signal<Record<number, EventoEffect>>({})

  public initializeEffects(effects: EventoEffect[]): void {
    const newState: Record<number, EventoEffect> = {};
    for (const effect of effects) {
      newState[effect.id] = effect;
    }
    this.state.set(newState);
  }

  public getEffectById(id: number): EventoEffect | undefined {
    return this.state()[id];
  }

  public findEffects(effectsIds: number[]): EventoEffect[] {
    return effectsIds
      .map(id => this.getEffectById(id))
      .filter((effect): effect is EventoEffect => effect !== undefined);
  }

  public exportState(): Record<number, EventoEffect> {
    return this.state();
  }

  public importState(state: Record<number, EventoEffect>): void {
    this.state.set(state);
  }
}
