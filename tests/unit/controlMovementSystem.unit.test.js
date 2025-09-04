import * as THREE from 'three';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

import { initKeyboard } from '../../src/input/keyboard.js';
import { controlMovementSystem } from '../../src/systems/controlMovementSystem.js';
import { setControlTarget } from '../../src/state/controlState.js';
import { getSnapshot } from '../../src/debug/debugState.js';

function press(key) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));
}
function release(key) {
  window.dispatchEvent(new KeyboardEvent('keyup', { key }));
}
function releaseAll() {
  ['w','a','s','d','q','e','Shift','shift'].forEach(k=>{
    window.dispatchEvent(new KeyboardEvent('keyup', { key: k }));
  });
}

function makeTank(at = {x:0,y:0,z:0}){
  const t = new THREE.Object3D();
  t.name = 'tank';
  t.position.set(at.x, at.y, at.z);
  t.rotation.set(0, 0, 0);
  t.userData = t.userData || {};
  return t;
}

beforeAll(()=>{
  // Ensure listeners are registered once
  initKeyboard();
});

beforeEach(()=>{
  releaseAll();
});

afterEach(()=>{
  // detach target
  setControlTarget(null);
  releaseAll();
});

describe('controlMovementSystem — unit', ()=>{
  it('W accelerates forward in local -Z and changes position', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { maxSpeed: 4, accel: 100, drag: 0 }); // high accel for quick settle
    press('w');
    // simulate 0.5s of holding W
    controlMovementSystem(0.5);
    const dz = tank.position.z;
    expect(dz).toBeLessThan(0); // moved toward -Z
    release('w');
  });

  it('S moves backward with reverseFactor limiting speed', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { maxSpeed: 4, reverseFactor: 0.25, accel: 100, drag: 0 });
    press('s');
    controlMovementSystem(1.0); // 1s accel to target
    // after long enough dt with high accel, velocity should clamp near -max*reverseFactor
    const snap = getSnapshot();
    expect(Math.abs(snap.fwdVel)).toBeLessThanOrEqual(4 * 0.25 + 1e-3);
    expect(snap.fwdVel).toBeLessThanOrEqual(0); // backward
    release('s');
  });

  it('A/D turn the tank when not strafing (no Shift)', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { maxSpeed: 0 }); // no forward movement
    press('a');
    controlMovementSystem(0.5);
    expect(tank.rotation.y).toBeLessThan(0); // A turns left (negative yaw)
    release('a');

    press('d');
    controlMovementSystem(0.5);
    expect(tank.rotation.y).toBeGreaterThan(0); // D turns right (positive yaw)
    release('d');
  });

  it('Hold Shift to strafe with A/D instead of turning', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { canStrafe: true, accel: 100, drag: 0, maxSpeed: 4 });
    // face 0 yaw, strafe right with Shift+D
    press('Shift'); press('d');
    controlMovementSystem(0.5);
    const dx = tank.position.x;
    expect(dx).toBeGreaterThan(0);
    // rotation should not change when strafing
    expect(Math.abs(tank.rotation.y)).toBeLessThan(1e-6);
    release('d'); release('Shift');
  });

  it('Drag reduces velocity to zero when no input', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { accel: 100, drag: 10, maxSpeed: 10 });
    press('w'); controlMovementSystem(0.3); release('w'); // gain some fwdVel, then release
    // apply drag for 1s
    controlMovementSystem(1.0);
    const snap = getSnapshot();
    expect(Math.abs(snap.fwdVel)).toBeLessThan(0.1); // nearly stopped
  });

  it('Braking decelerates faster than passive drag', ()=>{
    const tank1 = makeTank();
    const tank2 = makeTank();
    // scenario 1: drag only
    setControlTarget(tank1, { accel: 20, drag: 2, brake: 6, maxSpeed: 6 });
    press('w'); controlMovementSystem(0.5); release('w');
    // coast 1s
    controlMovementSystem(1.0);
    const vAfterDrag = getSnapshot().fwdVel;

    // scenario 2: braking (reverse input)
    setControlTarget(tank2, { accel: 20, drag: 2, brake: 6, maxSpeed: 6 });
    press('w'); controlMovementSystem(0.5); release('w');
    // immediately press S to brake for 1s
    press('s'); controlMovementSystem(1.0); release('s');
    const vAfterBrake = getSnapshot().fwdVel;

    expect(Math.abs(vAfterBrake)).toBeLessThan(Math.abs(vAfterDrag)); // brake reduces speed more
  });

  it('Turning scales with forward speed (faster turn when moving)', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { accel: 100, drag: 0, maxSpeed: 6, turnRate: 2 });
    // measure yaw change at near-zero speed
    press('a'); controlMovementSystem(0.2); release('a');
    const yawSlow = Math.abs(tank.rotation.y);

    // reset rotation
    tank.rotation.y = 0;

    // get up to speed forward, then turn
    press('w'); controlMovementSystem(0.5); release('w');
    press('a'); controlMovementSystem(0.2); release('a');
    const yawFast = Math.abs(tank.rotation.y);

    expect(yawFast).toBeGreaterThan(yawSlow);
  });

  it('allowFly true: Q/E move vertically', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { allowFly: true, maxSpeed: 4 });
    const y0 = tank.position.y;
    press('q'); controlMovementSystem(1.0); release('q'); // up
    expect(tank.position.y).toBeGreaterThan(y0);
    const y1 = tank.position.y;
    press('e'); controlMovementSystem(2.0); release('e'); // down more
    expect(tank.position.y).toBeLessThan(y1);
  });

  it('userData.drive persists across ticks', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { accel: 100, drag: 0, maxSpeed: 10 });
    press('w'); controlMovementSystem(0.2); release('w');
    const firstVel = getSnapshot().fwdVel;
    // no new drive object should be created; velocity should decay only by drag (which is 0)
    controlMovementSystem(0.2);
    const secondVel = getSnapshot().fwdVel;
    expect(secondVel).toBeCloseTo(firstVel, 5);
  });

  it('debug snapshot lists pressed keys', ()=>{
    const tank = makeTank();
    setControlTarget(tank, {});
    press('w'); press('a');
    controlMovementSystem(0.1);
    const snap = getSnapshot();
    expect(snap.keys).toEqual(expect.arrayContaining(['w','a']));
    release('w'); release('a');
  });
});
