import {CharacterID} from '../../../shared/enums/character-id';
import {CharacterName} from '../../../shared/enums/character-name';
import {Stats} from '../../../shared/enums/stats';
import {LocationID} from '../../../shared/enums/location-id';
import {Routine} from './routine';

export interface NpcState {

  id: CharacterID;
  name: CharacterName;
  stats: Record<Stats, number>;
  attractions: Record<CharacterID,number>
  currentLocation: LocationID
  routines: Routine[]
}
