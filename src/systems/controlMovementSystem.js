// src/systems/controlMovementSystem.js
import * as THREE from "three";
import { isDown } from "../input/keyboard.js";
import { getControlTarget } from "../state/controlState.js";
import { setLastFrameSnapshot } from "../debug/debugState.js";

/**
 * Tank-style movement:
 * - W/S: accelerate forward/backward relative to the tank's facing (local -Z/+Z).
 * - A/D: turn left/right (yaw). Hold Shift to STRAFE left/right instead of turning.
 * - Optional fly: Q up / E down when config.allowFly.
 *
 * Config overrides per control target (with defaults):
 *   maxSpeed: 4.0 (m/s)
 *   accel: 8.0 (m/s^2)
 *   brake: 12.0 (m/s^2)  // stronger decel when opposing input
 *   drag: 2.0 (m/s^2)    // passive slowdown when no input
 *   turnRate: 1.8 (rad/s)
 *   reverseFactor: 0.5   // reverse max speed fraction
 *   strafeFactor: 0.6    // strafe max speed fraction
 *   canStrafe: true
 */
export function controlMovementSystem(dt){
  const { target, config } = getControlTarget();
  if (!target){
    setLastFrameSnapshot({ dt, reason: 'no control target', keys: [], moveVec: {x:0,y:0,z:0,len:0} });
    return;
  }

  // Merge defaults
  const cfg = {
    maxSpeed: 4.0,
    accel: 8.0,
    brake: 12.0,
    drag: 2.0,
    turnRate: 1.8,
    reverseFactor: 0.5,
    strafeFactor: 0.6,
    canStrafe: true,
    allowFly: false,
    ...(config || {}),
  };

  // Persistent per-object drive state
  if (!target.userData.drive){
    target.userData.drive = { fwdVel: 0, strafeVel: 0 };
  }
  const drive = target.userData.drive;

  // Inputs
  const w = isDown('w') ? 1 : 0;
  const s = isDown('s') ? 1 : 0;
  const a = isDown('a') ? 1 : 0;
  const d = isDown('d') ? 1 : 0;
  const q = isDown('q') ? 1 : 0;
  const e = isDown('e') ? 1 : 0;
  const shift = isDown('shift');

  const forwardInput = w - s;           // +1 forward, -1 backward
  const lateralInput = d - a;           // +1 right, -1 left
  const strafing = cfg.canStrafe && shift;

  // TURN vs STRAFE
  let turnInput = 0;
  if (!strafing){
    // Yaw with A/D
    turnInput = lateralInput;
  }

  // Compute desired forward velocity change
  if (forwardInput !== 0){
    // Accelerate toward target max based on direction
    const maxForDir = forwardInput > 0 ? cfg.maxSpeed : cfg.maxSpeed * cfg.reverseFactor;
    const targetVel = maxForDir * Math.sign(forwardInput);
    const accel = (Math.sign(targetVel) === Math.sign(drive.fwdVel) || drive.fwdVel === 0)
      ? cfg.accel
      : cfg.brake; // opposing direction -> stronger
    const delta = Math.sign(targetVel - drive.fwdVel) * accel * dt;
    // If we would overshoot, clamp to targetVel
    if (Math.abs(targetVel - (drive.fwdVel + delta)) < Math.abs(delta)){
      drive.fwdVel = targetVel;
    } else {
      drive.fwdVel += delta;
    }
  } else {
    // Passive drag toward 0
    const sign = Math.sign(drive.fwdVel);
    const mag = Math.max(0, Math.abs(drive.fwdVel) - cfg.drag * dt);
    drive.fwdVel = mag * sign;
    if (Math.abs(drive.fwdVel) < 1e-3) drive.fwdVel = 0;
  }

  // Strafe velocity
  if (strafing && lateralInput !== 0){
    const maxStrafe = cfg.maxSpeed * cfg.strafeFactor;
    const targetVel = maxStrafe * Math.sign(lateralInput);
    const accel = (Math.sign(targetVel) === Math.sign(drive.strafeVel) || drive.strafeVel === 0)
      ? cfg.accel
      : cfg.brake;
    const delta = Math.sign(targetVel - drive.strafeVel) * accel * dt;
    if (Math.abs(targetVel - (drive.strafeVel + delta)) < Math.abs(delta)){
      drive.strafeVel = targetVel;
    } else {
      drive.strafeVel += delta;
    }
  } else {
    // drag strafe toward 0
    const sign = Math.sign(drive.strafeVel);
    const mag = Math.max(0, Math.abs(drive.strafeVel) - cfg.drag * dt);
    drive.strafeVel = mag * sign;
    if (Math.abs(drive.strafeVel) < 1e-3) drive.strafeVel = 0;
  }

  // Apply turning (scale slightly with forward speed for feel)
  if (turnInput !== 0){
    const speedFactor = 0.5 + 0.5 * Math.min(1, Math.abs(drive.fwdVel) / cfg.maxSpeed);
    target.rotation.y += turnInput * cfg.turnRate * speedFactor * dt;
  }

  // Compute world-space movement
  const forwardWorld = new THREE.Vector3(0, 0, -1).applyQuaternion(target.quaternion);
  const rightWorld   = new THREE.Vector3(1, 0, 0).applyQuaternion(target.quaternion);

  const deltaPos = new THREE.Vector3()
    .addScaledVector(forwardWorld, drive.fwdVel * dt)
    .addScaledVector(rightWorld,   drive.strafeVel * dt);

  // Vertical fly (optional)
  if (cfg.allowFly){
    const upInput = (q ? 1 : 0) - (e ? 1 : 0);
    if (upInput !== 0){
      const climb = cfg.maxSpeed * 0.5 * upInput * dt;
      deltaPos.y += climb;
    }
  }

  target.position.add(deltaPos);

  // Debug snapshot
  const keys = [];
  if (w) keys.push('w'); if (a) keys.push('a'); if (s) keys.push('s'); if (d) keys.push('d');
  if (q) keys.push('q'); if (e) keys.push('e'); if (shift) keys.push('shift');
  setLastFrameSnapshot({
    dt,
    reason: (w||a||s||d||q||e) ? 'moved' : 'idle',
    keys,
    moveVec: { x: deltaPos.x, y: deltaPos.y, z: deltaPos.z, len: deltaPos.length() },
    fwdVel: drive.fwdVel,
    strafeVel: drive.strafeVel,
    target: target.name || target.type,
    controlPos: target.position
  });
}
