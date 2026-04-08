export type CubeType = 'image' | 'text' | 'button' | 'video';

export interface Cube {
  id:number
  type: CubeType;
  order: number;
  probability: number;
  styleClass: string[];
}
