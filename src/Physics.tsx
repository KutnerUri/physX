import { Force, Matter, Position, Vector2D } from "./Matter";
import { momentumCollide } from "./momentum-collision";
import { Vector } from "./V";

/** system constant, do not change */
const TIMEOUT_SECOND = 1000;
const ZeroVector = [0, 0] as Vector2D;

// world info
const GRAVITY_SCALAR = -9.807;

type PhysOptions<T> = {
  onChange?: (items: T[]) => void;
  /** number of "tick" per real world second
   * @default 60
   */
  FPS: number;
  /** simulated second in real world time.
   * @default 1000ms
   */
  second: number;
  /** simulated meter.
   * @default 1000
   */
  meter: number;
};

const defaultOptions: PhysOptions<any> = {
  FPS: 60,
  second: 1000,
  meter: 1000,
};

export class Physics<T extends Matter> {
  constructor(private _options?: Partial<PhysOptions<T>>) {}
  options: PhysOptions<T> = { ...defaultOptions, ...this._options };

  private items = new Set<T>();
  public gravityForce = this.createForce(0, GRAVITY_SCALAR);
  public globalForces = [this.gravityForce];

  createPosition(...vector: Position): Position {
    return Vector.from(vector)
      .scalar(this.options.meter)
      .value.map(Math.round) as Position;
  }

  createForce(...vector: Force): Force {
    return Vector.from(vector).scalar(this.options.meter).value;
  }

  /** game time coefficient */
  private get timeScale() {
    return TIMEOUT_SECOND / this.options.second;
  }

  /** simulated time of a single tick */
  private get tickScale() {
    return this.timeScale / this.options.FPS;
  }

  /** real world time of a single tick */
  private get tickRealMs() {
    return TIMEOUT_SECOND / this.options.FPS;
  }

  start() {
    const tid = setInterval(() => this.tick(), this.tickRealMs);
    const stop = () => {
      clearInterval(tid);
    };
    return stop;
  }

  add(item: T) {
    this.items.add(item);
  }

  applyForce(item: T, force: Force, duration: number = 1) {
    const actualForce = this.createForce(...force);
    const actualDuration = duration * this.options.second;

    item.forces.push(actualForce);

    setTimeout(
      () => (item.forces = item.forces.filter((f) => f !== actualForce)),
      actualDuration
    );
  }

  private tick() {
    this.handleCollisions();

    this.items.forEach((item) => {
      const moment = Vector.from(ZeroVector)
        .add(...item.forces, ...this.globalForces)
        .scalar(this.tickScale)
        .add(item.moment);
      item.moment = moment.value;

      const nextPos = moment.scalar(this.tickScale).add(item.pos).value;

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
                Vector.diff(item.pos, other.pos).length() <
                item.radius + other.radius
            )
            // remove duplicates - v [b1, b2], x [b2,b1]
            .filter((other) => {
              const diff = Vector.diff(other.pos, item.pos).value;
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
