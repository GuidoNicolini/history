import {Cube} from './cube';
import {CharacterID} from '../../../../shared/enums/character-id';

export interface TextCube extends Cube{
  text: string
  character: CharacterID
}
