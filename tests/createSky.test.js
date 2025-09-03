import { describe, it, expect } from "vitest";
import { createScene } from "../src/engine/createScene.js";
import { createSky } from "../src/engine/createSky.js";
import * as THREE from "three";

describe("createSky", () => {
  it("adds a directional light (sun) to the scene", () => {
    const { scene } = createScene();
    const { sun } = createSky(scene, { sunIntensity: 0.7 });
    expect(sun).toBeInstanceOf(THREE.DirectionalLight);
    expect(scene.children).toContain(sun);
    expect(sun.castShadow).toBe(true);
  });
});
