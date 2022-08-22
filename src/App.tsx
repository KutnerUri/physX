import { ReactNode, ComponentType, useState, useEffect } from "react";
import "./App.css";
import { Force, Matter, Momentum, Position } from "./Matter";
import {
  createForce,
  SIM_METER,
  Physics,
  posToAbs,
  SIM_SECOND,
  meterToPixel,
} from "./Physics";
import styles from "./styles.module.scss";
import { V } from "./V";

interface Displayable extends Matter {
  id: string;
  color?: string;
  Component: ComponentType<{ item: Displayable }>;
}

var counter = 0;

class BallItem implements Displayable {
  constructor({
    pos,
    mass = 1,
    forces = [],
    color = "red",
  }: {
    pos: Position;
    mass?: number;
    forces?: Force[];
    color?: string;
  }) {
    this.id = "ball" + ++counter;
    this.mass = mass;
    this.pos = pos;
    this.forces = forces;
    this.moment = [0, 0];
    this.color = color;
  }

  id: string;
  Component = Ball;
  pos: Position;
  mass: number;
  forces: Force[];
  moment: Momentum;
  color: string;

  radius = 80;
  get center(): Position {
    return V.from(this.pos).scalar(this.radius).value;
  }
}

const physX = new Physics<Displayable>();
const throwForce1 = createForce(5, 20);
const throwForce2 = createForce(-5, 20);
const ball = new BallItem({
  pos: [1 * SIM_METER, 0],
  forces: [throwForce1],
  color: "brown",
});
const ball2 = new BallItem({
  pos: [5 * SIM_METER, 0],
  forces: [throwForce2],
  color: "darkgreen",
});

setTimeout(() => {
  ball.forces = ball.forces.filter((f) => f !== throwForce1);
  ball2.forces = ball2.forces.filter((f) => f !== throwForce2);
}, 0.5 * SIM_SECOND);

physX.add(ball);
physX.add(ball2);

// // const rnd = (limit: number) => Math.round(Math.random() * limit);
// const balls = [
//   ball,
//   ball2,
//   // new BallItem({ pos: [SIM_METER, SIM_METER] }),
//   // new BallItem({ pos: [rnd(3 * SIM_METER), rnd(3 * SIM_METER)] }),
//   // new BallItem({ pos: [rnd(5 * SIM_METER), rnd(5 * SIM_METER)] }),
//   // new BallItem({ pos: [rnd(5 * SIM_METER), rnd(5 * SIM_METER)] }),
//   // new BallItem({ pos: [rnd(5 * SIM_METER), rnd(5 * SIM_METER)] }),
// ];
// balls.forEach((b) => physX.add(b));

function App() {
  const [items, setItems] = useState([] as Displayable[]);
  physX.options.onChange = (items) => setItems(items);

  useEffect(() => {
    return physX.start();
  }, []);

  return (
    <Arena>
      <div className={styles.reference}></div>
      {items.map((item) => (
        <item.Component item={item} key={item.id} />
      ))}
    </Arena>
  );
}

function Arena({ children }: { children: ReactNode }) {
  return <div className={styles.arena}>{children}</div>;
}

function Ball({ item }: { item: Displayable }) {
  return (
    <div
      className={styles.ball}
      style={{
        ...posToAbs(item.pos),
        width: meterToPixel(item.radius * 2),
        height: meterToPixel(item.radius * 2),
        background: item.color,
      }}
    />
  );
}

export default App;
