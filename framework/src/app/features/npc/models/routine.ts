import {Day} from '../../../shared/enums/day';
import {LocationID} from '../../../shared/enums/location-id';
import {GameCondition} from '../../../shared/Models/game-condition';

export interface Routine {
  days: Day[];
  InitialTime: number // ejemplo -> hora 14
  FinalTime: number // ejemplo -> hora 20
  location: LocationID
  routineConditions: GameCondition[]
  weight: number ,
}
