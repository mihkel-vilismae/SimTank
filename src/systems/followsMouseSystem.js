// src/systems/followsMouseSystem.js
import * as THREE from "three";
import { getPointerState } from "../state/pointerState.js";

/**
 * Computes and exposes the world-space ground point under the mouse on y=0 plane.
 * Stores it on `scene.userData.mouseGround` as a THREE.Vector3.
 */
export function followsMouseSystem(dt, { scene, camera }) {
  const raycaster = new THREE.Raycaster();
  const ptr = getPointerState();
  const mouse = new THREE.Vector2(ptr.ndcX, ptr.ndcY);
  raycaster.setFromCamera(mouse, camera);
  const t = -raycaster.ray.origin.y / raycaster.ray.direction.y || 0;
  const hit = new THREE.Vector3().copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);
  scene.userData.mouseGround = hit;
}
