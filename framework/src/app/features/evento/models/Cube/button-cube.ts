import {Cube} from './cube';

export interface ButtonCube extends Cube{
  text: string
  conditions: number[]
  cubeAction: CubeAction
}



export type ActionType = 'redirection' | 'save' | 'buy'

export interface CubeAction {

  type: ActionType;
  value: any;
}
