export type Vector2D = [x: number, y: number];

export type Position = [x: number, y: number];
export type Force = Vector2D;
export type Momentum = Vector2D;

export interface Matter {
  pos: Vector2D;
  mass: number;
  forces: Force[];
  moment: Momentum;

  // TODO
  center: Position;
  radius: number;
}
