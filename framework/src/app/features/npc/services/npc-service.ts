import {Injectable, signal, inject, Injector} from '@angular/core';
import {NpcState} from '../models/npc-state';
import {RelationState} from '../models/relation-state';
import {Stats} from '../../../shared/enums/stats';
import {CharacterID} from '../../../shared/enums/character-id';
import {LocationID} from '../../../shared/enums/location-id';
import {Day} from '../../../shared/enums/day';
import {ConditionEvaluator} from '../../condition/services/condition-evaluator';
import {ConditionService} from '../../condition/services/condition-service';
import { ISaveable } from '../../../shared/interfaces/saveable.interface';
import { SaveLoadService } from '../../../shared/services/save-load-service';

@Injectable({
  providedIn: 'root',
})
export class NpcService implements ISaveable {
  public saveKey = 'npcs';

  constructor(private saveLoadService: SaveLoadService) {
    this.saveLoadService.register(this);
  }

  // 1. EL ESTADO CENTRAL (Diccionario de todos los NPCs)
  //el primer numero es el id del npc
  public state = signal<Record<number, NpcState>>({});
  public stateRelation = signal<Record<number, RelationState>>({})

  private injector = inject(Injector);

  // 2. INICIALIZACIÓN
  public initializeNpcs(npcData: NpcState[], relationData: RelationState[] = []): void {
    const npcsRecord = npcData.reduce((acc, npc) => {
      acc[npc.id] = npc;
      return acc;
    }, {} as Record<number, NpcState>);
    this.state.set(npcsRecord);

    const relationsRecord = relationData.reduce((acc, relation) => {
      const relationId = this.generateRelationId(relation.id1, relation.id2);
      acc[relationId] = relation;
      return acc;
    }, {} as Record<number, RelationState>);
    this.stateRelation.set(relationsRecord);
  }

  public getStat(npcId: CharacterID, stat: Stats): number {
    const npcs = this.state();
    const npc = npcs[npcId];
    if (!npc) return 0;
    return npc.stats[stat] || 0;
  }

  public getAvatar(npcId: CharacterID): string {
    const npcs = this.state();
    const npc = npcs[npcId];
    return npc ? npc.avatar : '';
  }

  public getName(npcId: CharacterID): string {
    const npcs = this.state();
    const npc = npcs[npcId];
    return npc ? npc.name : '';
  }

  public modifyStat(npcId: CharacterID, stat: Stats, amount: number): void {
    this.state.update(npcs => {
      const npc = npcs[npcId];
      if (!npc) return npcs;

      const currentLevel = npc.stats[stat] || 0;
      return {
        ...npcs,
        [npcId]: {
          ...npc,
          stats: { ...npc.stats, [stat]: currentLevel + amount }
        }
      };
    });
  }

  public modifyRandomStat(npcId: CharacterID, stat: Stats, maxValue: number): void {
    const npcs = this.state();
    const npc = npcs[npcId];
    if (!npc) return;

    const currentLevel = npc.stats[stat] || 0;

    let probability = 0.10;
    if (maxValue > currentLevel) {
      probability = (maxValue - currentLevel) / maxValue;
    }

    if (Math.random() <= probability) {
      this.modifyStat(npcId, stat, 1);
    }
  }

  public generateRelationId(id1: CharacterID, id2: CharacterID): number {
    const minId = Math.min(id1, id2);
    const maxId = Math.max(id1, id2);
    return minId * 10000 + maxId;
  }

  public getRelationByCharacters(id1: CharacterID, id2: CharacterID): RelationState | undefined {
    const relationId = this.generateRelationId(id1, id2);
    return this.getRelationById(relationId);
  }

  public getRelationById(relationId: number): RelationState | undefined {
    return this.stateRelation()[relationId];
  }

  public modifyAttraction(npcPrincipalId: CharacterID, npcSecondaryId: CharacterID, amount: number): void {
    const relationId = this.generateRelationId(npcPrincipalId, npcSecondaryId);

    this.stateRelation.update(relations => {
      const existingRelation = relations[relationId];

      if (existingRelation) {
        return {
          ...relations,
          [relationId]: {
            ...existingRelation,
            value: existingRelation.value + amount
          }
        };
      } else {
        const minId = Math.min(npcPrincipalId, npcSecondaryId);
        const maxId = Math.max(npcPrincipalId, npcSecondaryId);

        return {
          ...relations,
          [relationId]: {
            id1: minId as CharacterID,
            id2: maxId as CharacterID,
            value: amount
          }
        };
      }
    });
  }

  public increaseAllArousal(): void {
    const npcs = this.state();
    for (const idStr of Object.keys(npcs)) {
      const npcId = parseInt(idStr, 10) as CharacterID;
      this.modifyStat(npcId, Stats.AROUSAL, 10);
    }
  }

  // MOTOR DE RUTINAS

  public updateRoutines(day: Day, time: number): void {
    // Se obtiene de forma "lazy" (perezosa) para evitar una dependencia circular.
    // ConditionEvaluator ya inyecta a NpcService, si lo inyectamos de forma tradicional, Angular lanzaría error.
    const conditionEvaluator = this.injector.get(ConditionEvaluator);
    const conditionService = this.injector.get(ConditionService);

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
          const isTimeValid = time >= routine.initialTime && time < routine.finalTime;

          if (!isDayValid || !isTimeValid) return false;

          const conditions = conditionService.findConditions(routine.routineConditions || []);
          return conditionEvaluator.checkAll(conditions);
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
  public exportState(): { npcs: Record<number, NpcState>, relations: Record<number, RelationState> } {
    return {
      npcs: this.state(),
      relations: this.stateRelation()
    };
  }

  public importState(savedState: { npcs: Record<number, NpcState>, relations: Record<number, RelationState> }): void {
    if (savedState.npcs) {
      this.state.set(savedState.npcs);
    }
    if (savedState.relations) {
      this.stateRelation.set(savedState.relations);
    }
  }

}
