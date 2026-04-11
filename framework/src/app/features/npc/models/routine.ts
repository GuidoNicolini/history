import {Day} from '../../../shared/enums/day';
import {LocationID} from '../../../shared/enums/location-id';

export interface Routine {
  days: Day[];
  InitialTime: number // ejemplo -> hora 14
  FinalTime: number // ejemplo -> hora 20
  location: LocationID
  routineConditions: number[]
  weight: number ,
}
