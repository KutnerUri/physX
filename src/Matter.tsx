export type Vector = [x: number, y: number];

export type Position = [x: number, y: number];
export type Force = Vector;
export type Momentum = Vector;

export interface Matter {
  pos: Vector;
  mass: number;
  forces: Force[];
  moment: Momentum;
}
