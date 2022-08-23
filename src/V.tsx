// TODO - force V to have consistent length

export class Vector<V extends number[]> {
  constructor(public value: V) {}

  /** add two or more vectors */
  add(...vectors: V[]) {
    const next = vectors.reduce(addVectors, this.value);
    return new Vector(next);
  }

  /** multiply vector by a constant */
  scalar(value: number) {
    const next = this.value.map((v) => v * value) as V;
    return new Vector(next);
  }

  // || (a1, a2, ...) ||  = sqart(a1^2, a2^2, ...)
  length(): number {
    return Math.round(
      Math.sqrt(
        this.value.reduce((prev, current) => prev + current * current, 0)
      )
    );
  }

  static diff<V extends Array<number>>(a: V, b: V) {
    return Vector.from(b).scalar(-1).add(a);
  }

  static from<V extends Array<number>>(value: V) {
    return new Vector(value);
  }

  static innerProduct<V extends Array<number>>(a: V, b: V) {
    return a
      .map((aVal, index) => {
        const bVal = b[index];
        return aVal * bVal;
      })
      .reduce((prev, next) => prev + next);
  }
}

function addVectors<V extends Array<number>>(v1: V, v2: V) {
  return v1.map((value, idx) => value + v2[idx]) as V;
}
