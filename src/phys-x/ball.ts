import { Force, Matter, Momentum, Position } from "../Matter";
import { Vector } from "../V";

export class Ball implements Matter {
  constructor({
    pos,
    mass = 1,
    radius = 80,
    forces = [],
  }: {
    pos: Position;
    mass?: number;
    radius?: number;
    forces?: Force[];
  }) {
    this.mass = mass;
    this.pos = pos;
    this.forces = forces;
    this.moment = [0, 0];
    this.radius = radius;
  }

  pos: Position;
  mass: number;
  forces: Force[];
  moment: Momentum;
  radius: number;

  get center(): Position {
    return Vector.from(this.pos).add([this.radius, this.radius]).value;
  }
}
