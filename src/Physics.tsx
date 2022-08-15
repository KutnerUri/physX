import { CSSProperties } from "react";
import { Force, Matter, Position } from "./Matter";
import { V } from "./V";

const FPS = 60;
export const SECOND = 1000; // milliseconds
export const METER = 1;
const METER_IN_PIXELS = 100;

const PIXEL_SCALE = METER_IN_PIXELS / METER;
const TIME_SCALE = 1 / FPS;

function meterToPixel(meters: number) {
  return Math.round(meters * PIXEL_SCALE);
}

export function posToAbs(pos: Position): CSSProperties {
  const [x, y] = pos;

  return { left: meterToPixel(x), bottom: meterToPixel(y) };
}

// world info
const GRAVITY_SCALAR = -9.807;

// derived:
// const tickDuration = SECOND * TIME_SCALE;

export function createForce(...vector: Force): Force {
  return V.from(vector).scalar(METER).value;
}

const Gravity: Force = createForce(0, GRAVITY_SCALAR);

export class Physics<T extends Matter> {
  constructor(public options: { onChange?: (items: T[]) => void } = {}) {}

  private items = new Set<T>();

  start() {
    const tid = setInterval(() => this.tick(), 1000 / FPS);
    const stop = () => {
      clearInterval(tid);
    };
    return stop;
  }

  add(item: T) {
    item.forces.push(Gravity);
    this.items.add(item);
  }

  private tick() {
    const collisions = this.detectCollisions();
    collisions.forEach(([item, collided]) => {
      const v = V.diff(item.pos, collided.pos).scalar(0.001).value;

      item.forces.push(v);

      setTimeout(() => {
        item.forces = item.forces.filter((x) => x !== v);
      }, 10);
    });

    this.items.forEach((item) => {
      const moment = V.from([0, 0])
        .add(...item.forces)
        .scalar(TIME_SCALE)
        .add(item.moment);
      item.moment = moment.value;

      const translation = moment;
      const nextPos = translation.scalar(TIME_SCALE).add(item.pos).value;

      // TODO - reset moment when getting to bottom
      item.pos = DontEscape(nextPos);
    });

    this.options.onChange?.(this.list());
  }

  detectCollisions() {
    return Array.from(this.items)
      .map((item) => {
        return Array.from(this.items)
          .filter((other) => item !== other)
          .filter((other) => V.diff(item.pos, other.pos).length() < 10000)
          .map((other) => [item, other]);
      })
      .flat();
  }

  list() {
    return Array.from(this.items);
  }
}

function DontEscape(pos: Position): Position {
  return [Math.max(0, pos[0]), Math.max(0, pos[1])];
}
