import { describe, it, expect } from "vitest";
import { createScene } from "../src/engine/createScene.js";
import { createGround } from "../src/engine/createGround.js";

describe("createGround", () => {
  it("adds a ground mesh to the scene", () => {
    const { scene } = createScene();
    const { ground } = createGround(scene, { size: 10 });
    expect(ground).toBeDefined();
    expect(ground.receiveShadow).toBe(true);
    expect(scene.children).toContain(ground);
  });
});
