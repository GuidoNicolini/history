import {Injectable, signal, computed} from '@angular/core';
import {HeroState} from '../models/hero-state';
import {Stats} from '../../../shared/enums/stats';
import {Avatar} from '../../../shared/enums/avatar';
import {GameItems} from '../../../shared/enums/game-items';
import { ISaveable } from '../../../shared/interfaces/saveable.interface';
import { SaveLoadService } from '../../../shared/services/save-load-service';

@Injectable({
  providedIn: 'root',
})
export class HeroService implements ISaveable {
  public saveKey = 'hero';

  constructor(private saveLoadService: SaveLoadService) {
    this.saveLoadService.register(this);
  }

  // 1. EL ESTADO CENTRAL (Signal)
  // Inicializamos el estado vacío, esperando ser inicializado por initializeHero
  public state = signal<HeroState>({} as HeroState);

  // Inicializa el héroe a partir de un objeto JSON
  public initializeHero(heroData: HeroState): void {
    this.state.set(heroData);
  }

  // 2. COMPUTADOS (Variables reactivas derivadas)
  // Esto recalcula automáticamente la energía máxima si el héroe sube de fuerza o agilidad
  public maxEnergy = computed(() => {
    const stats = this.state().stats;
    if (!stats) return 100; // Protección en caso de que aún no se haya inicializado
    return 100 + (stats[Stats.STRENGTH] || 0) + (stats[Stats.AGILITY] || 0);
  });



  public getAvatar(): Avatar {
    return this.state().avatar;
  }

  public getName(): string {
    return this.state().name;
  }


  // 3. MÉTODOS DE MODIFICACIÓN DE ESTADÍSTICAS
  public modifyStat(stat: Stats, amount: number): void {
    this.state.update(currentState => ({
      ...currentState,
      stats: {
        ...currentState.stats,
        [stat]: (currentState.stats?.[stat] || 0) + amount
      }
    }));
  }

  public modifyEnergy(amount: number): void {
    this.state.update(currentState => {
      const currentEnergy = currentState.stats?.[Stats.ENERGY] || 0;
      let newEnergy = currentEnergy + amount;

      // Aplicar límites superior (maxEnergy) e inferior (0)
      const limit = 100 + (currentState.stats?.[Stats.STRENGTH] || 0) + (currentState.stats?.[Stats.AGILITY] || 0);
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
    const currentLevel = this.state().stats?.[stat] || 0;

    let probability = 0.10;
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
        [item]: (currentState.inventory?.[item] || 0) + quantity
      }
    }));
  }

  public removeItem(item: GameItems, quantity: number): void {
    this.state.update(currentState => ({
      ...currentState,
      inventory: {
        ...currentState.inventory,
        [item]: Math.max(0, (currentState.inventory?.[item] || 0) - quantity) // Evita inventario negativo
      }
    }));
  }

  // 5. MÉTODOS DE LECTURA (Helpers)
  public getItemQuantity(item: GameItems): number {
    return this.state().inventory?.[item] || 0;
  }

  public getStatLevel(stat: Stats): number {
    return this.state().stats?.[stat] || 0;
  }

  public getStat(stat: Stats): number {
    return this.state().stats?.[stat] || 0;
  }

  // 6. GUARDADO Y CARGA (¡Mira lo fácil que es ahora!)
  public exportState(): HeroState {
    return this.state(); // Retorna el objeto puro
  }

  public importState(savedState: HeroState): void {
    this.state.set(savedState); // Restaura tod0 el estado de golpe
  }
}
