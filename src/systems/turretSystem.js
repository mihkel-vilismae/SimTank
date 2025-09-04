// src/systems/turretSystem.js
import * as THREE from "three";
import { yawFromQuaternion } from "../math/yawFromQuaternion.js";
import { getPointerState } from "../state/pointerState.js";

/**
 * Rotates tank turret toward the mouse ground intersection and pitches gun up/down.
 * Expects tank object with child meshes named:
 *  - "tank_turret_ring" or "tank_turret_dome" for yaw anchor (we'll rotate both if present)
 *  - "tank_gun_barrel" (and optional "tank_gun_muzzle") for elevation
 *
 * Config via entity.components.turret:
 *  { yawSpeed?: number (rad/s), pitchSpeed?: number (rad/s), minPitch?: number, maxPitch?: number }
 */
export function turretSystem(dt, { scene, camera, registry }) {
  const raycaster = new THREE.Raycaster();
  const ptr = getPointerState();

  // compute ground intersection at y=0 plane
  const mouse = new THREE.Vector2(ptr.ndcX, ptr.ndcY);
  raycaster.setFromCamera(mouse, camera);
  const t = -raycaster.ray.origin.y / raycaster.ray.direction.y || 0;
  const groundHit = new THREE.Vector3().copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);

  for (const ent of registry.all()) {
    const comp = ent.components || {};
    if (!comp.turret) continue;

    // hull yaw (world)
    const hullQ = new THREE.Quaternion();
    ent.getWorldQuaternion(hullQ);
    const hullYaw = yawFromQuaternion(hullQ);

    const hullPos = new THREE.Vector3();
    ent.getWorldPosition(hullPos);

    const dx = groundHit.x - hullPos.x;
    const dz = groundHit.z - hullPos.z;
    const desiredYawWorld = Math.atan2(dx, dz); // +Z forward convention
    const desiredYawRelative = normalizeAngle(desiredYawWorld - hullYaw);

    const yawSpeed = comp.turret.yawSpeed ?? 2.8;
    const maxStep = yawSpeed * dt;

    const ring = ent.getObjectByName("tank_turret_ring");
    const dome = ent.getObjectByName("tank_turret_dome");
    const barrel = ent.getObjectByName("tank_gun_barrel");
    const muzzle = ent.getObjectByName("tank_gun_muzzle");

    // Apply yaw to any available turret parts (relative to hull)
    if (ring) ring.rotation.y = stepTo(ring.rotation.y, desiredYawRelative, maxStep);
    if (dome) dome.rotation.y = stepTo(dome.rotation.y, desiredYawRelative, maxStep);
    if (barrel) barrel.rotation.y = stepTo(barrel.rotation.y, desiredYawRelative, maxStep);
    if (muzzle) muzzle.rotation.y = stepTo(muzzle.rotation.y, desiredYawRelative, maxStep);

    // Elevation (pitch) using barrel; compute angle to groundHit from barrel base
    if (barrel) {
      const barrelBase = new THREE.Vector3();
      barrel.getWorldPosition(barrelBase);
      const diff = new THREE.Vector3().subVectors(groundHit, barrelBase);
      const horiz = Math.hypot(diff.x, diff.z);
      let desiredPitch = Math.atan2(diff.y, horiz); // up positive

      // neutral barrel is rotation.z = +PI/2; pitch up means adding positive
      const minPitch = comp.turret.minPitch ?? THREE.MathUtils.degToRad(-5);
      const maxPitch = comp.turret.maxPitch ?? THREE.MathUtils.degToRad(25);
      const pitchSpeed = comp.turret.pitchSpeed ?? THREE.MathUtils.degToRad(120);

      // current elevation relative to neutral
      let curPitch = barrel.rotation.z - Math.PI / 2;
      const step = pitchSpeed * dt;
      const next = stepTo(curPitch, desiredPitch, step);
      const clamped = THREE.MathUtils.clamp(next, minPitch, maxPitch);
      barrel.rotation.z = Math.PI / 2 + clamped;

      // keep muzzle in sync if present
      if (muzzle) {
        muzzle.rotation.z = barrel.rotation.z;
      }
    }
  }
}

function stepTo(current, target, maxStep){
  let delta = normalizeAngle(target - current);
  const s = Math.sign(delta);
  const mag = Math.min(Math.abs(delta), Math.abs(maxStep));
  return normalizeAngle(current + s * mag);
}

function normalizeAngle(a){
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}
