import { ReactNode, ComponentType, useState, useEffect } from "react";
import "./App.css";
import { PhysCanvas } from "./canvas";
import { Force, Matter, Momentum, Position } from "./Matter";
import { Physics } from "./Physics";
import styles from "./styles.module.scss";
import { Vector } from "./V";

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
    return Vector.from(this.pos).scalar(this.radius).value;
  }
}

const physX = new Physics<Displayable>();
const canvas = new PhysCanvas();
const ball = new BallItem({ pos: physX.createPosition(1, 0), color: "brown" });
const ball2 = new BallItem({
  pos: physX.createPosition(5, 0),
  color: "darkgreen",
});

physX.add(ball);
physX.add(ball2);
physX.applyForce(ball, [5, 20], 0.5);
physX.applyForce(ball2, [-5, 20], 0.5);

const rnd = (limit: number) => Math.random() * limit;
const balls = [
  new BallItem({ pos: physX.createPosition(1, 1) }),
  new BallItem({ pos: physX.createPosition(rnd(3), rnd(3)) }),
  new BallItem({ pos: physX.createPosition(rnd(5), rnd(5)) }),
  new BallItem({ pos: physX.createPosition(rnd(5), rnd(5)) }),
  new BallItem({ pos: physX.createPosition(rnd(5), rnd(5)) }),
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
  return (
    <div
      className={styles.ball}
      style={{
        ...canvas.projectStyles(item),
        background: item.color,
      }}
    />
  );
}

export default App;
