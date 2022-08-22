import { Vector } from "./Matter";

// function isNear(a: Position, b: Position, threshold: number) {
//   const diff = V.diff(a, b).length();
//   return diff < threshold;
// }
export class V {
  constructor(public value: Vector = [0, 0]) {}
  add(...vectors: Vector[]) {
    const next = vectors.reduce(
      (prev, current) => [prev[0] + current[0], prev[1] + current[1]],
      this.value
    );

    return new V(next);
  }

  scalar(value: number) {
    const next = this.value.map((v) => v * value) as Vector;
    return new V(next);
  }

  length() {
    return Math.round(
      Math.sqrt(
        this.value.reduce((prev, current) => prev + current * current, 0)
      )
    );
  }

  static diff(a: Vector, b: Vector) {
    return V.from(b).scalar(-1).add(a);
  }

  static from(value: Vector) {
    return new V(value);
  }

  static innerProduct(a: Vector, b: Vector) {
    return a
      .map((aVal, index) => {
        const bVal = b[index];
        return aVal * bVal;
      })
      .reduce((prev, next) => prev + next);
  }
}
