import * as THREE from 'three';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

import { initKeyboard } from '../../src/input/keyboard.js';
import { controlMovementSystem } from '../../src/systems/controlMovementSystem.js';
import { velocityTrackerSystem } from '../../src/systems/velocityTrackerSystem.js';
import { setControlTarget, getControlTarget } from '../../src/state/controlState.js';
import { getVelocity, resetMotion } from '../../src/state/motionState.js';

function press(key) { window.dispatchEvent(new KeyboardEvent('keydown', { key })); }
function release(key) { window.dispatchEvent(new KeyboardEvent('keyup', { key })); }
function releaseAll() { ['w','a','s','d','q','e','Shift','shift'].forEach(k=>window.dispatchEvent(new KeyboardEvent('keyup', { key: k }))); }

function makeTank(){
  const t = new THREE.Object3D();
  t.name = 'tank';
  t.userData = {};
  return t;
}

beforeAll(()=>{
  initKeyboard();
});

beforeEach(()=>{
  releaseAll();
});

afterEach(()=>{
  const { target } = getControlTarget();
  if (target) resetMotion(target);
  setControlTarget(null);
  releaseAll();
});

describe('movement integration', ()=>{
  it('drive forward for 2 seconds, then turn right 1 second', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { accel: 8, drag: 2, maxSpeed: 6, turnRate: 2 });
    // forward 2s
    press('w');
    for (let i=0;i<20;i++){
      controlMovementSystem(0.1);
      velocityTrackerSystem(0.1);
    }
    release('w');
    const posAfterForward = tank.position.clone();
    const velAfterForward = getVelocity(tank);
    expect(posAfterForward.z).toBeLessThan(0); // moved -Z
    expect(Math.hypot(velAfterForward.x, velAfterForward.y, velAfterForward.z)).toBeGreaterThan(0);

    // turn right 1s, no strafe
    press('d');
    for (let i=0;i<10;i++){
      controlMovementSystem(0.1);
      velocityTrackerSystem(0.1);
    }
    release('d');
    expect(tank.rotation.y).toBeGreaterThan(0); // turned positive yaw
  });

  it('shift-strafe right does not change yaw but moves +X', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { canStrafe: true, accel: 10, drag: 0, maxSpeed: 5 });
    press('Shift'); press('d');
    for (let i=0;i<10;i++){
      controlMovementSystem(0.1);
      velocityTrackerSystem(0.1);
    }
    release('d'); release('Shift');
    expect(tank.position.x).toBeGreaterThan(0);
    expect(Math.abs(tank.rotation.y)).toBeLessThan(1e-6);
  });

  it('allowFly disabled: Q/E have no effect', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { allowFly: false, maxSpeed: 4 });
    const y0 = tank.position.y;
    press('q');
    for (let i=0;i<10;i++){ controlMovementSystem(0.1); }
    release('q');
    expect(tank.position.y).toBeCloseTo(y0, 6);
  });

  it('allowFly enabled: Q raises Y', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { allowFly: true, maxSpeed: 4 });
    const y0 = tank.position.y;
    press('q');
    for (let i=0;i<10;i++){ controlMovementSystem(0.1); }
    release('q');
    expect(tank.position.y).toBeGreaterThan(y0);
  });

  it('velocityTrackerSystem tracks speed after movement', ()=>{
    const tank = makeTank();
    setControlTarget(tank, { accel: 12, drag: 1, maxSpeed: 8 });
    press('w');
    for (let i=0;i<5;i++){
      controlMovementSystem(0.2);
      velocityTrackerSystem(0.2);
    }
    release('w');
    const v = getVelocity(tank);
    expect(Math.abs(v.x)+Math.abs(v.y)+Math.abs(v.z)).toBeGreaterThan(0);
  });
});
