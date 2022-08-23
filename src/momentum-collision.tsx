import { Matter, Momentum } from "./Matter";
import { Vector } from "./V";

// copied off the internet
// https://www.youtube.com/watch?v=eED4bSkYCB8
// works when colliding 2 circles / balls
//
//              2m2      <v1 - v2, C1 - C2>
// v1' = v1 - ------- * ------------------ * (C1 - C2)
//            (m1+m2)     ||C1 - C2||^2

export function momentumCollide(a: Matter, b: Matter, ): Momentum {
  // 2*m2 / (m1+m2)
  const massScalar = (2 * b.mass) / (a.mass + b.mass);
  // ||C1-C2||
  const distance = Vector.diff(a.center, b.center).length();

  // v1 - v2
  const momentumDiff = Vector.diff(a.moment, b.moment);

  // C1 - C2
  const distanceDiff = Vector.diff(a.center, b.center);

  // <v1-v2,C1-C2>
  const product = Vector.innerProduct(momentumDiff.value, distanceDiff.value);

  const scalar = (massScalar * product) / Math.pow(distance, 2);

  // the momentum applied
  const reaction = distanceDiff.scalar(scalar);

  return Vector.diff(a.moment, reaction.value).value;
}


// 2 * m2 / (m1+m2)       relative mass
// C1 - C2                vector of the collision
//  C1 - C2 / ||C1 - C2|| normalized vector of the collision
// <v1 - v1, C1 - C2>     ???
//
// inner product          https://en.wikipedia.org/wiki/Inner_product_space