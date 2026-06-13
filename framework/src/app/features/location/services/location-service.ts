import {Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '../models/location';
import {LocationID} from '../../../shared/enums/location-id';
import {ConditionEvaluator} from '../../condition/services/condition-evaluator';
import {ConditionService} from '../../condition/services/condition-service';
import {TimeService} from '../../time/services/time-service';
import {ISaveable} from '../../../shared/interfaces/saveable.interface';
import {SaveLoadService} from '../../../shared/services/save-load-service';
import {TypeLocation} from '../../../shared/enums/type-location';

@Injectable({
  providedIn: 'root',
})
export class LocationService implements ISaveable {
  public saveKey = 'locations';
  //EL primer numero es para el id de la location
  public state = signal<Record<number, Location>>({})

  constructor(
    private conditionEvaluator: ConditionEvaluator,
    private conditionService: ConditionService,
    private timeService: TimeService,
    private router: Router,
    private saveLoadService: SaveLoadService
  ) {
    this.saveLoadService.register(this);
  }

  public initilizeLocations(locationData: Location[]): void {

    const locationsRecord = locationData.reduce((acc, location) => {
      acc[location.id] = location;
      return acc;
    }, {} as Record<number, Location>);
    this.state.set(locationsRecord);
  }


  /**
   * Busca una location por su ID en el estado actual.
   * @param locationId El ID de la location a buscar.
   * @returns La location encontrada o undefined si no existe.
   */
  public findLocationById(locationId: LocationID): Location | undefined {
    return this.state()[locationId];
  }



  public findSubLocations(locationId: LocationID): Location[] {
    const location = this.findLocationById(locationId);
    const subLocationArray:Location[] = []

    location?.subLocations.forEach(id => {
      const subLocation = this.findLocationById(id);
      if (subLocation) {
        subLocationArray.push(subLocation);
      }
    })

    return subLocationArray
  }


  /**
   * Actualiza el estado de disponibilidad de una location basado en sus condiciones.
   * @param locationId El ID de la location a actualizar.
   */
  public updateAvailability(locationId: LocationID): void {
    const location = this.findLocationById(locationId);
    if (location) {
      const conditions = this.conditionService.findConditions(location.conditionsAvailable || []);

      if(location.type === TypeLocation.ACTIVITY){
        location.isAvailable = this.conditionEvaluator.checkAll(conditions, location.backUrl);
      } else {
        location.isAvailable = this.conditionEvaluator.checkAll(conditions);
      }

    }
  }

  /**
   * Actualiza el estado de visibilidad de una location basado en sus condiciones.
   * @param locationId El ID de la location a actualizar.
   */
  public updateVisibility(locationId: LocationID): void {
    const location = this.findLocationById(locationId);
    if (location) {
      const conditions = this.conditionService.findConditions(location.conditionsVisible || []);

      if(location.type === TypeLocation.ACTIVITY){
        location.isVisible = this.conditionEvaluator.checkAll(conditions, location.backUrl);
      } else {
        location.isVisible = this.conditionEvaluator.checkAll(conditions);
      }

    }
  }

  /**
   * Actualiza la última vez que se visitó una location con el día actual.
   * @param locationId El ID de la location a actualizar.
   */
  public updateLastTimeVisited(locationId: LocationID): void {
    const location = this.findLocationById(locationId);
    if (location) {
      location.lastTimeVisited = this.timeService.state().day;
    }
  }

  /**
   * Redirige a la URL de la location.
   * @param locationId El ID de la location a la que redirigir.
   */
  public redirectToLocation(locationId: LocationID): void {
    const location = this.findLocationById(locationId);
    if (location && location.url) {
      this.router.navigate([location.url]);
    }
  }



  /**
   * Exporta el estado actual del servicio de Locations.
   * @returns El estado actual.
   */
  public exportState(): Record<number, { lastTimeVisited: number }> {
    const currentState = this.state();
    const exported: Record<number, { lastTimeVisited: number }> = {};
    Object.keys(currentState).forEach(idStr => {
      const id = parseInt(idStr, 10);
      exported[id] = {
        lastTimeVisited: currentState[id].lastTimeVisited
      };
    });
    return exported;
  }

  /**
   * Importa y establece un estado para el servicio de Locations.
   * @param state El estado a importar.
   */
  public importState(state: Record<number, { lastTimeVisited: number }>): void {
    if (state) {
      this.state.update(currentState => {
        const updatedState = { ...currentState };
        Object.keys(state).forEach(idStr => {
          const id = parseInt(idStr, 10);
          const savedLoc = state[id];
          const currentLoc = currentState[id];
          if (currentLoc && savedLoc) {
            updatedState[id] = {
              ...currentLoc,
              lastTimeVisited: savedLoc.lastTimeVisited
            };
          }
        });
        return updatedState;
      });
    }
  }


}
