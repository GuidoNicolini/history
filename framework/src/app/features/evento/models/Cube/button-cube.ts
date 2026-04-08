import {Cube} from './cube';
import {CubeAction} from './cube-action';
import {GameCondition} from '../../../../shared/Models/game-condition';

export interface ButtonCube extends Cube{
  text: string
  conditions: GameCondition[]
  cubeAction: CubeAction
}
