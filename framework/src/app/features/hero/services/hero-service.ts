import {computed, Injectable, signal} from '@angular/core';
import {HeroState} from '../models/hero-state';
import {CharacterID} from '../../../shared/enums/character-id';
import {CharacterName} from '../../../shared/enums/character-name';
import {Stats} from '../../../shared/enums/stats';
import {GameItems} from '../../../shared/enums/game-items';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  // 1. EL ESTADO CENTRAL (Signal)
  // Inicializamos al héroe con sus valores por defecto
  public readonly state = signal<HeroState>({
    id: CharacterID.HERO,
    name: CharacterName.HERO,
    stats: {
      [Stats.LEVEL]: 1,
      [Stats.ENERGY]: 100,
      [Stats.AROUSAL]: 1,
      [Stats.CORRUPTION]: 1,
      [Stats.STRENGTH]: 1,
      [Stats.AGILITY]: 1,
      [Stats.INTELLIGENCE]: 1,
      [Stats.CHARISMA]: 1,
      [Stats.HYGIENE]: 100,
    } as Record<Stats, number>,
    inventory: {
      [GameItems.MONEY]: 100,
      [GameItems.SNACK]: 5
    } as Record<GameItems, number>
  });

  // 2. COMPUTADOS (Variables reactivas derivadas)
  // Esto recalcula automáticamente la energía máxima si el héroe sube de fuerza o agilidad
  public maxEnergy = computed(() => {
    const stats = this.state().stats;
    return 100 + (stats[Stats.STRENGTH] || 0) + (stats[Stats.AGILITY] || 0);
  });

  // 3. MÉTODOS DE MODIFICACIÓN DE ESTADÍSTICAS
  public modifyStat(stat: Stats, amount: number): void {
    this.state.update(currentState => ({
      ...currentState,
      stats: {
        ...currentState.stats,
        [stat]: (currentState.stats[stat] || 0) + amount
      }
    }));
  }

  public modifyEnergy(amount: number): void {
    this.state.update(currentState => {
      const currentEnergy = currentState.stats[Stats.ENERGY] || 0;
      let newEnergy = currentEnergy + amount;

      // Aplicar límites superior (maxEnergy) e inferior (0)
      const limit = 100 + (currentState.stats[Stats.STRENGTH] || 0) + (currentState.stats[Stats.AGILITY] || 0);
      if (newEnergy > limit) newEnergy = limit;
      if (newEnergy < 0) newEnergy = 0;

      return {
        ...currentState,
        stats: {
          ...currentState.stats,
          [Stats.ENERGY]: newEnergy
        }
      };
    });
  }

  public modifyRandomStat(stat: Stats, maxValue: number): void {
    const currentLevel = this.state().stats[stat] || 0;

    let probability = 0.05;
    if (maxValue > currentLevel) {
      probability = (maxValue - currentLevel) / maxValue;
    }

    if (Math.random() <= probability) {
      this.modifyStat(stat, 1);
    }
  }

  // 4. MÉTODOS DE INVENTARIO
  public addItem(item: GameItems, quantity: number): void {
    this.state.update(currentState => ({
      ...currentState,
      inventory: {
        ...currentState.inventory,
        [item]: (currentState.inventory[item] || 0) + quantity
      }
    }));
  }

  public removeItem(item: GameItems, quantity: number): void {
    this.state.update(currentState => ({
      ...currentState,
      inventory: {
        ...currentState.inventory,
        [item]: Math.max(0, (currentState.inventory[item] || 0) - quantity) // Evita inventario negativo
      }
    }));
  }

  // 5. MÉTODOS DE LECTURA (Helpers)
  public getItemQuantity(item: GameItems): number {
    return this.state().inventory[item] || 0;
  }

  public getStatLevel(stat: Stats): number {
    return this.state().stats[stat] || 0;
  }

  public getStat(stat: Stats): number {
    return this.state().stats[stat] || 0;
  }

  // 6. GUARDADO Y CARGA (¡Mira lo fácil que es ahora!)
  public exportState(): HeroState {
    return this.state(); // Retorna el objeto puro
  }

  public importState(savedState: HeroState): void {
    this.state.set(savedState); // Restaura todo el estado de golpe
  }
}
