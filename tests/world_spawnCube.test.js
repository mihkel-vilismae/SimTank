import { describe, it, expect } from "vitest";
import { createScene } from "../src/engine/createScene.js";
import { createRegistry } from "../src/engine/registry.js";
import { spawnCube } from "../src/world/spawnCube.js";

describe("world/spawnCube", () => {
  it("spawns a cube into the scene and registry", () => {
    const { scene } = createScene();
    const registry = createRegistry();
    const mesh = spawnCube({ scene, registry, at: { x: 1, y: 2, z: 3 } });

    expect(scene.children).toContain(mesh);
    expect(mesh.position.x).toBeCloseTo(1);
    expect(mesh.position.y).toBeCloseTo(2);
    expect(mesh.position.z).toBeCloseTo(3);
    expect(mesh.castShadow).toBe(true);
    expect([...registry.all()]).toContain(mesh);
  });
});
