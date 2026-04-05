import {Injectable, signal, Injector, inject} from '@angular/core';
import {NpcState} from '../models/npc-state';
import {CharacterID} from '../../../shared/enums/character-id';
import {Stats} from '../../../shared/enums/stats';
import {Day} from '../../../shared/enums/day';
import {LocationID} from '../../../shared/enums/location-id';
import {ConditionEvaluator} from '../../../shared/services/condition-evaluator';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  // 1. EL ESTADO CENTRAL (Diccionario de todos los NPCs)
  //el primer numero es el id del npc
  public state = signal<Record<number, NpcState>>({});

  private injector = inject(Injector);

  // 2. INICIALIZACIÓN
  public initializeNpcs(): void {
    //TODO: Inicializar npcs desde jsons

    //this.state.set(initialNpcs) esto esta como ejemplo para como debe terminar el metodo
  }

  public getStat(npcId: CharacterID, stat: Stats): number {
    const npcs = this.state();
    const npc = npcs[npcId];
    if (!npc) return 0;
    return npc.stats[stat] || 0;
  }

  public modifyStat(npcId: CharacterID, stat: Stats, maxValue: number): void {
    this.state.update(npcs => {
      const npc = npcs[npcId];
      if (!npc) return npcs;

      const currentLevel = npc.stats[stat] || 0;
      let probability = 0.05;
      if (maxValue > currentLevel) {
        probability = (maxValue - currentLevel) / maxValue;
      }

      if (Math.random() <= probability) {
        return {
          ...npcs,
          [npcId]: {
            ...npc,
            stats: { ...npc.stats, [stat]: currentLevel + 1 }
          }
        };
      }
      return npcs; // No hubo cambio
    });
  }


  public increaseAttraction(npcPrincipalId: CharacterID, npcSecondaryId: CharacterID): void {
    this.state.update(npcs => {
      const npc = npcs[npcPrincipalId];
      if (!npc) return npcs;

      const currentAttraction = npc.attractions[npcSecondaryId] || 0;

      return {
        ...npcs,
        [npcPrincipalId]: {
          ...npc,
          attractions: {
            ...npc.attractions,
            [npcSecondaryId]: currentAttraction + 1
          }
        }
      };
    });
  }


  // MOTOR DE RUTINAS

  public updateRoutines(day: Day, time: number): void {
    // Se obtiene de forma "lazy" (perezosa) para evitar una dependencia circular.
    // ConditionEvaluator ya inyecta a NpcService, si lo inyectamos de forma tradicional, Angular lanzaría error.
    const conditionEvaluator = this.injector.get(ConditionEvaluator);

    this.state.update(npcs => {
      let hasChanges = false;
      const nextState = { ...npcs };

      for (const idStr of Object.keys(npcs)) {
        const npcId = parseInt(idStr, 10);
        const npc = nextState[npcId];
        if (!npc) continue;

        let nextLocation = LocationID.VOID;

        // 2: recorrer sus rutinas
        // 2a: ver cuáles cumplen todas sus condiciones (día, hora y routineConditions)
        const availableRoutines = npc.routines.filter(routine => {
          const isDayValid = routine.days.includes(day);
          const isTimeValid = time >= routine.InitialTime && time < routine.FinalTime;

          if (!isDayValid || !isTimeValid) return false;

          return conditionEvaluator.checkAll(routine.routineConditions);
        });

        if (availableRoutines.length === 1) {
          // 3a: si hay una sola rutina disponible establecer como currentLocation el LocationID de esa rutina
          nextLocation = availableRoutines[0].location;
        } else if (availableRoutines.length > 1) {
          // 3b: si hay dos o más rutinas disponibles sumar los pesos y hacer selección aleatoria ponderada
          const totalWeight = availableRoutines.reduce((sum, r) => sum + r.weight, 0);
          let randomValue = Math.random() * totalWeight;

          for (const routine of availableRoutines) {
            randomValue -= routine.weight;
            if (randomValue <= 0) {
              nextLocation = routine.location;
              break;
            }
          }
        }
        // 3C: en caso de que no haya ninguna rutina disponible se establecerá la LocationID VOID (valor por defecto)

        // Actualizamos sólo si la ubicación realmente cambió
        if (npc.currentLocation !== nextLocation) {
          nextState[npcId] = {
            ...npc,
            currentLocation: nextLocation
          };
          hasChanges = true;
        }
      }

      // Evitamos disparar reactividad si ningún NPC cambió de ubicación
      return hasChanges ? nextState : npcs;
    });
  }








  // 6. GUARDADO Y CARGA
  public exportState(): Record<number, NpcState> {
    return this.state();
  }

  public importState(savedState: Record<number, NpcState>): void {
    this.state.set(savedState);
  }

}
