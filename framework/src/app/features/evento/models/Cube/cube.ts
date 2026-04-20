export type CubeType = 'image' | 'text' | 'button' | 'video' | 'code';

export interface Cube {
  id:number
  type: CubeType;
  order: number;
  probability: number;
  styleClass: string[];
}
