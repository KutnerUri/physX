import { CSSProperties } from "react";
import { Force, Matter, Position } from "./Matter";
import { momentumCollide } from "./momentum-collision";
import { V } from "./V";

const TIMEOUT_SECOND = 1000; // system constant, do not change
const FPS = 60;
export const SIM_METER = 1000;
export const SIM_SECOND = 1000;
const METER_IN_PIXELS = 100;

// world info
const GRAVITY_SCALAR = -9.807;

// derived:
const pixelScale = METER_IN_PIXELS / SIM_METER;
const timeScale = TIMEOUT_SECOND / SIM_SECOND;
const TICK_SCALE = timeScale / FPS;
const TICK_REAL_MS = TIMEOUT_SECOND / FPS;

export function meterToPixel(meters: number) {
  return Math.round(meters * pixelScale);
}

export function posToAbs(pos: Position): CSSProperties {
  const [x, y] = pos;

  return { left: meterToPixel(x), bottom: meterToPixel(y) };
}

export function createForce(...vector: Force): Force {
  return V.from(vector).scalar(SIM_METER).value;
}

const Gravity: Force = createForce(0, GRAVITY_SCALAR);

export class Physics<T extends Matter> {
  constructor(public options: { onChange?: (items: T[]) => void } = {}) {}

  private items = new Set<T>();

  start() {
    const tid = setInterval(() => this.tick(), TICK_REAL_MS);
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
    this.handleCollisions();

    this.items.forEach((item) => {
      const moment = V.from([0, 0])
        .add(...item.forces)
        .scalar(TICK_SCALE)
        .add(item.moment);
      item.moment = moment.value;

      const translation = moment;
      const nextPos = translation.scalar(TICK_SCALE).add(item.pos).value;

      // TODO - reset moment when getting to bottom
      item.pos = DontEscape(nextPos);
    });

    this.options.onChange?.(this.list());
  }

  private handleCollisions() {
    const collisions = this.detectCollisions();
    collisions.forEach(([item, collided]) => {
      const nextItemMoment = momentumCollide(item, collided);
      const nextCollidedMoment = momentumCollide(collided, item);
      item.moment = nextItemMoment;
      collided.moment = nextCollidedMoment;
    });
  }

  private detectCollisions() {
    return Array.from(this.items)
      .map((item) => {
        return (
          Array.from(this.items)
            .filter((other) => item !== other)
            .filter(
              (other) =>
                V.diff(item.pos, other.pos).length() <
                item.radius + other.radius
            )
            // remove duplicates - [b1, b2], [b2,b1]
            .filter((other) => {
              const diff = V.diff(other.pos, item.pos).value;
              return diff[0] > 0 || (diff[0] === 0 && diff[1] > 0);
            })
            .map((other) => [item, other])
        );
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
