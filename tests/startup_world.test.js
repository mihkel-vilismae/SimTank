import { describe, it, expect } from "vitest";
import { config } from "../src/config.js";
import { createScene } from "../src/engine/createScene.js";
import { addBasicLighting } from "../src/engine/createLighting.js";
import { createGround } from "../src/engine/createGround.js";
import { createSky } from "../src/engine/createSky.js";
import { createRegistry } from "../src/engine/registry.js";
import { spawnCube } from "../src/world/spawnCube.js";
import * as THREE from "three";

describe("startup world", () => {
  it("creates scene with cube, ground, and sun", () => {
    const { scene } = createScene();
    if (config.features.ambientLight) addBasicLighting(scene);
    if (config.features.ground) createGround(scene, config.ground);
    if (config.features.sky) createSky(scene, config.sky);

    const registry = createRegistry();
    const cube = spawnCube({ scene, registry, at: { x: 0, y: 0.5, z: 0 } });

    // Ground present
    const ground = scene.children.find(o => o.name === "Ground");
    expect(ground).toBeDefined();

    // Sun (DirectionalLight) present
    const sun = scene.children.find(o => o instanceof THREE.DirectionalLight);
    expect(sun).toBeDefined();
    expect(sun.castShadow).toBe(true);

    // Cube present and positioned
    expect(scene.children).toContain(cube);
    expect(cube.position.y).toBeCloseTo(0.5);
  });
});
