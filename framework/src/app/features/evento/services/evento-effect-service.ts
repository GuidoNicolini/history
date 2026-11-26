import {Injectable, signal} from '@angular/core';
import {EventoEffect} from '../models/evento-effect';

@Injectable({
  providedIn: 'root',
})
export class EventoEffectService {
  public state = signal<Record<number, EventoEffect>>({})

  constructor() {}

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
}
