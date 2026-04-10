import {Injectable, signal} from '@angular/core';
import {Location} from '../models/location';
import {LocationID} from '../../../shared/enums/location-id';
import {ConditionEvaluator} from '../../../shared/services/condition-evaluator';
import {TimeService} from '../../time/services/time-service';
import {Router} from '@angular/router';
import {TypeLocation} from '../../../shared/enums/type-location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  //EL primer numero es para el id de la location
  public state = signal<Record<number, Location>>({})

  constructor(
    private conditionEvaluator: ConditionEvaluator,
    private timeService: TimeService,
    private router: Router
  ) {}

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
      location.isAvailable = this.conditionEvaluator.checkAll(location.conditionsAvailable);
    }
  }

  /**
   * Actualiza el estado de visibilidad de una location basado en sus condiciones.
   * @param locationId El ID de la location a actualizar.
   */
  public updateVisibility(locationId: LocationID): void {
    const location = this.findLocationById(locationId);
    if (location) {
      location.isVisible = this.conditionEvaluator.checkAll(location.conditionsVisible);
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
  public exportState(): Record<number, Location> {
    return this.state();
  }

  /**
   * Importa y establece un estado para el servicio de Locations.
   * @param state El estado a importar.
   */
  public importState(state: Record<number, Location>): void {
    this.state.set(state);
  }


}
