import {LocationID} from '../../../shared/enums/location-id';
import {Cube} from './Cube/cube';
import {EventoType} from '../../../shared/enums/evento-type';

export interface EventoState {

  id: string;
  type: EventoType;
  location: LocationID;
  probability: number;
  numberOfTimesActivated: number;
  cooldownDuration: number;
  lastDayActivated: number;
  cubes: Cube[];
  conditions: number[]
  effects: number[]


}
