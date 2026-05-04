import {CharacterID} from '../../../shared/enums/character-id';
import {Stats} from '../../../shared/enums/stats';
import {LocationID} from '../../../shared/enums/location-id';
import {Routine} from './routine';
import {Avatar} from '../../../shared/enums/avatar';

export interface NpcState {

  id: CharacterID;
  name: string;
  stats: Record<Stats, number>;
  currentLocation: LocationID;
  routines: Routine[];
  avatar: Avatar;
}
