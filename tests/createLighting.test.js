import { describe, it, expect } from "vitest";
import { createScene } from "../src/engine/createScene.js";
import { addBasicLighting } from "../src/engine/createLighting.js";
import * as THREE from "three";

describe("addBasicLighting", () => {
  it("adds an ambient light to the scene", () => {
    const { scene } = createScene();
    const { ambient } = addBasicLighting(scene);
    expect(ambient).toBeInstanceOf(THREE.AmbientLight);
    expect(scene.children).toContain(ambient);
  });
});
