// src/systems/controlMovementSystem.js
import * as THREE from "three";
import { isDown } from "../input/keyboard.js";
import { getControlTarget } from "../state/controlState.js";

/**
 * Moves the currently controlled object using WASD; Q/E for vertical when allowed.
 * W/S move along -Z/+Z, A/D along -X/+X. Simple world-axes motion for clarity.
 */
export function controlMovementSystem(dt){
  const { target, config } = getControlTarget();
  if (!target) return;

  const speed = Math.max(0, config?.speed ?? 3.0); // m/s
  const v = new THREE.Vector3(0,0,0);

  // Horizontal plane (XZ)
  if (isDown('w')) v.z -= 1;
  if (isDown('s')) v.z += 1;
  if (isDown('a')) v.x -= 1;
  if (isDown('d')) v.x += 1;

  // Vertical (fly) if allowed
  if (config?.allowFly){
    if (isDown('q')) v.y += 1;
    if (isDown('e')) v.y -= 1;
  }

  if (v.lengthSq() === 0) return;

  v.normalize().multiplyScalar(speed * dt);
  target.position.add(v);
}
