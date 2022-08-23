import { Matter, Vector2D } from "./Matter";
import { Ball } from "./phys-x/ball";
import { Physics } from "./Physics";

const sim_speed = 100; // 100x
const sim_second = 1000 / sim_speed;

let phys: Physics<Matter>;
let stop: () => void;

beforeEach(() => {
  phys = new Physics({ second: sim_second });
  stop = phys.start();
});

afterEach(() => {
  stop();
});

it("should push ball down, when gravity is enabled", async () => {
  const ball = new Ball({ pos: [1000, 1000] });
  phys.add(ball);

  await new Promise((res) => setTimeout(res, 20));

  expect(ball.pos).toEqual([1000, 0]);
});
