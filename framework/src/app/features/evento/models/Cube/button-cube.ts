import {Cube} from './cube';
import {CubeAction} from './cube-action';
import {GameCondition} from '../../../condition/models/game-condition';

export interface ButtonCube extends Cube{
  text: string
  conditions: GameCondition[]
  cubeAction: CubeAction
}
