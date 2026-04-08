import {LocationID} from '../../../shared/enums/location-id';
import {Cube} from './Cube/cube';
import {GameCondition} from '../../../shared/Models/game-condition';
import {EventoEffect} from './evento-effect';
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
  conditions: GameCondition[]
  effects : EventoEffect[]

}
