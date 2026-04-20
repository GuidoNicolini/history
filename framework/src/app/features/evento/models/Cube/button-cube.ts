import {Cube} from './cube';
import {CubeAction} from './cube-action';

export interface ButtonCube extends Cube{
  text: string
  conditions: number[]
  cubeAction: CubeAction
}
