import { describe, it, expect } from "vitest";
import { createCamera } from "../src/engine/createCamera.js";

describe("createCamera", () => {
  it("creates a perspective camera with provided aspect", () => {
    const cam = createCamera({ aspect: 2, position: { x:1, y:2, z:3 } });
    expect(cam.isPerspectiveCamera).toBe(true);
    expect(cam.aspect).toBeCloseTo(2);
    expect(cam.position.x).toBeCloseTo(1);
    expect(cam.position.y).toBeCloseTo(2);
    expect(cam.position.z).toBeCloseTo(3);
  });
});
