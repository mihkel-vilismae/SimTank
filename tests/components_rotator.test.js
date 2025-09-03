import { describe, it, expect } from "vitest";
import { addRotator } from "../src/components/rotator.js";

describe("components/rotator", () => {
  it("attaches rotator component with speeds", () => {
    const obj = {};
    addRotator(obj, { x:1, y:2, z:3 });
    expect(obj.components.rotator.speed).toEqual({ x:1, y:2, z:3 });
  });
});
