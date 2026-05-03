import {CharacterID} from '../../../shared/enums/character-id';
import {Stats} from '../../../shared/enums/stats';
import {GameItems} from '../../../shared/enums/game-items';
import {Avatar} from '../../../shared/enums/avatar';

export interface HeroState {

  id: CharacterID;
  name: string;
  stats: Record<Stats, number>;
  inventory: Record<GameItems, number>;
  avatar: Avatar
}
