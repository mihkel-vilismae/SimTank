import { makeCubeAppearance } from "../entities/cube/makeCubeAppearance.js";
import { addRotator } from "../components/rotator.js";

export function spawnCube({ scene, registry, at = { x: 0, y: 0, z: 0 } } = {}) {
  const mesh = makeCubeAppearance({ color: 0x00ff00, size: 1 });
  mesh.castShadow = true;
  mesh.position.set(at.x, at.y, at.z);

  // attach behavior as components (can be conditional/configurable)
  addRotator(mesh, { x: 0.8, y: 0.6 });

  // put into world + registry
  scene.add(mesh);
  registry.add(mesh);

  return mesh;
}
