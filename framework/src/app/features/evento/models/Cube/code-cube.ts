import {Cube} from './cube';

export interface CodeCube extends Cube{
  functionName: string
  parameters: string[]
  conditions: number[]
}
