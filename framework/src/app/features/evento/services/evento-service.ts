import {Injectable, signal, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {EventoState} from '../models/evento-state';
import {EventoType} from '../../../shared/enums/evento-type';
import {LocationID} from '../../../shared/enums/location-id';
import {ConditionEvaluator} from '../../../shared/services/condition-evaluator';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  //el primer string es para el id del evento
  public state = signal<Record<string, EventoState>>({})

  constructor(private router: Router, private injector: Injector) {}

  public initializeEventos(): void {
    //TODO: Initializar eventos utilizando json en el futuro
  }

  public getEventoById(id: string): EventoState | undefined {
    return this.state()[id];
  }


  public getEventosByType(type: EventoType): EventoState[] {
    return Object.values(this.state()).filter(evento => evento.type === type);
  }

  public launchLocationEvento(locationId: LocationID): void {
    // Usamos el Injector localmente para evitar una dependencia circular con ConditionEvaluator
    const evaluator = this.injector.get(ConditionEvaluator);
    const validEventos = Object.values(this.state()).filter(evento =>
      evento.type === EventoType.LOCATION &&
      evento.location === locationId &&
      evaluator.checkAll(evento.conditions, evento.id)
    );

    if (validEventos.length === 0) {
      return;
    } else if (validEventos.length === 1) {
      this.launchEventoById(validEventos[0].id);
    } else {
      const totalProbability = validEventos.reduce((sum, evento) => sum + evento.probability, 0);
      const randomValue = Math.random() * totalProbability;

      let currentSum = 0;
      for (const evento of validEventos) {
        currentSum += evento.probability;
        if (randomValue <= currentSum) {
          this.launchEventoById(evento.id);
          break;
        }
      }
    }
  }


  public addEvento(evento: EventoState): void {
    this.state.update(state => ({
      ...state,
      [evento.id]: evento
    }));
  }

  public launchEventoById(id: string): void {
    this.router.navigate(['evento/' + id]);
  }

  public launchEventoByGroup(ids: string[]): void {
    if (!ids || ids.length === 0) return;

    const currentState = this.state();

    // Filtrar los eventos que existen y tienen probabilidad válida
    const eventos = ids
      .map(id => currentState[id])
      .filter(evento => evento !== undefined && evento.probability > 0);

    if (eventos.length === 0) return;

    // Sumar las probabilidades
    const totalProbability = eventos.reduce((sum, evento) => sum + evento.probability, 0);

    // Generar un número aleatorio entre 0 y la suma de probabilidades
    const randomValue = Math.random() * totalProbability;

    // Seleccionar el evento basado en la probabilidad
    let currentSum = 0;
    for (const evento of eventos) {
      currentSum += evento.probability;
      if (randomValue <= currentSum) {
        this.launchEventoById(evento.id);
        break;
      }
    }
  }

  public increaseNumberOfTimesActivated(id: string): void {
    this.state.update(state => {
      const evento = state[id];
      if (!evento) return state;
      return {
        ...state,
        [id]: {
          ...evento,
          numberOfTimesActivated: (evento.numberOfTimesActivated || 0) + 1
        }
      };
    });
  }

  public stampLastDayUsed(id: string, day: number): void {
    this.state.update(state => {
      const evento = state[id];
      if (!evento) return state;
      return {
        ...state,
        [id]: {
          ...evento,
          lastDayActivated: day
        }
      };
    });
  }

  public modifyLastDayUsedAndNumberOfTimesActivated(id: string, day: number): void {
    this.state.update(state => {
      const evento = state[id];
      if (!evento) return state;
      return {
        ...state,
        [id]: {
          ...evento,
          lastDayActivated: day,
          numberOfTimesActivated: (evento.numberOfTimesActivated || 0) + 1
        }
      };
    });
  }

  public exportState(): Record<string, EventoState> {
    return this.state();
  }

  public importState(newState: Record<string, EventoState>): void {
    this.state.set(newState);
  }
}
