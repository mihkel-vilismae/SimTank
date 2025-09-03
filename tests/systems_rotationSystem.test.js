import { describe, it, expect } from "vitest";
import { createRegistry } from "../src/engine/registry.js";
import { addRotator } from "../src/components/rotator.js";
import { rotationSystem } from "../src/systems/rotationSystem.js";

describe("systems/rotationSystem", () => {
  it("rotates entities with rotator component", () => {
    const registry = createRegistry();
    const obj = { rotation: { x:0, y:0, z:0 } };
    addRotator(obj, { x:1, y:0.5, z:0 });
    registry.add(obj);

    rotationSystem(0.1, registry); // dt=0.1
    expect(obj.rotation.x).toBeCloseTo(0.1);
    expect(obj.rotation.y).toBeCloseTo(0.05);
  });
});
