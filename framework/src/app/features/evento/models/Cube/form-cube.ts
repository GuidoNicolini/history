import {Cube} from './cube';
export type FunctionName = 'npc-name' | 'vip'
export interface FormCube extends Cube{

  fuctionName: FunctionName
  placeHolder : string
  parameters: string[]

}
