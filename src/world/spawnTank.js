import * as THREE from "three";
import { makeTankAppearance } from "../entities/tank/makeTankAppearance.js";

/**
 * Spawns a high-fidelity tank and registers it.
 */
export function spawnTank({ scene, registry, at = { x: 2, y: 0.5, z: 0 }, scale = 1.0 } = {}){
  const tank = makeTankAppearance({ scale });
  tank.position.set(at.x, at.y, at.z);
  scene.add(tank);
  registry.add(tank);
  return tank;
}
