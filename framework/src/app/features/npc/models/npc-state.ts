import {CharacterID} from '../../../shared/enums/character-id';
import {CharacterName} from '../../../shared/enums/character-name';
import {Stats} from '../../../shared/enums/stats';
import {LocationID} from '../../../shared/enums/location-id';
import {Routine} from './routine';
import {Avatar} from '../../../shared/enums/avatar';

export interface NpcState {

  id: CharacterID;
  name: CharacterName;
  stats: Record<Stats, number>;
  currentLocation: LocationID;
  routines: Routine[];
  avatar: Avatar;
}
