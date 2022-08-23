import { CSSProperties } from "react";
import { Matter, Position } from "./Matter";

const SIM_METER = 1000;
const METER_IN_PIXELS = 100;
const pixelScale = METER_IN_PIXELS / SIM_METER;

// will be used to cast 3d physics to a 2d canvas

export class PhysCanvas {
  constructor(public scale = 0.1) {}

  private toPixels(meters: number) {
    return Math.round(meters * pixelScale);
  }

  private castPosition(pos: Position): CSSProperties {
    const [x, y] = pos;

    return { left: this.toPixels(x), bottom: this.toPixels(y) };
  }

  private castSize(radius: number): CSSProperties {
    return {
      height: this.toPixels(radius * 2),
      width: this.toPixels(radius * 2),
    };
  }

  projectStyles(obj: Matter): CSSProperties {
    const { pos, radius } = obj;

    return { ...this.castPosition(pos), ...this.castSize(radius) };
  }
}
