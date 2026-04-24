import {Cube} from './cube';
export type FunctionName = 'npc-name'
export interface FormCube extends Cube{

  fuctionName: FunctionName
  placeHolder : string
  parameters: string[]

}
