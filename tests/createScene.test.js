import { describe, it, expect } from "vitest";
import { createScene } from "../src/engine/createScene.js";

describe("createScene", () => {
  it("returns a scene", () => {
    const { scene } = createScene();
    expect(scene).toBeDefined();
    expect(scene.isScene).toBe(true);
  });
});
