import {Day} from '../../../shared/enums/day';
import {LocationID} from '../../../shared/enums/location-id';

export interface Routine {
  days: Day[];
  initialTime: number // ejemplo -> hora 14
  finalTime: number // ejemplo -> hora 20
  location: LocationID
  routineConditions: number[]
  weight: number ,
}
