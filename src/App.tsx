import { ReactNode, ComponentType, useState, useEffect } from "react";
import "./App.css";
import { Force, Matter, Momentum, Position } from "./Matter";
import { createForce, METER, Physics, posToAbs, SECOND_IN_SIM } from "./Physics";
import styles from "./styles.module.scss";

interface Displayable extends Matter {
  id: string;
  Component: ComponentType<{ item: Displayable }>;
}

var counter = 0;

class BallItem implements Displayable {
  constructor({
    pos,
    mass = 1,
    forces = [],
  }: {
    pos: Position;
    mass?: number;
    forces?: Force[];
  }) {
    this.id = "ball" + ++counter;
    this.mass = mass;
    this.pos = pos;
    this.forces = forces;
    this.moment = [0, 0];
  }

  id: string;
  Component = Ball;
  pos: Position;
  mass: number;
  forces: Force[];
  moment: Momentum;
}

const physX = new Physics<Displayable>();
const throwForce = createForce(2, 15);
const ball = new BallItem({
  pos: [1 * METER, 1 * METER],
  forces: [throwForce],
});
setTimeout(
  () => (ball.forces = ball.forces.filter((f) => f !== throwForce)),
  1 * SECOND_IN_SIM
);

physX.add(ball);

const rnd = (limit: number) => Math.round(Math.random() * limit);
const balls = [
  new BallItem({ pos: [METER, METER] }),
  new BallItem({ pos: [rnd(3 * METER), rnd(3 * METER)] }),
  new BallItem({ pos: [rnd(5 * METER), rnd(5 * METER)] }),
  new BallItem({ pos: [rnd(5 * METER), rnd(5 * METER)] }),
  new BallItem({ pos: [rnd(5 * METER), rnd(5 * METER)] }),
];
balls.forEach((b) => physX.add(b));

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
  return <div className={styles.ball} style={posToAbs(item.pos)} />;
}

export default App;
