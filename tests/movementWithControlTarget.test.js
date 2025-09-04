// tests/movementWithControlTarget.test.js
import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
vi.mock('../src/input/keyboard.js', () => ({
  initKeyboard: vi.fn(),
  isDown: (k) => k.toLowerCase() === 'w',
  wasPressedOnce: vi.fn(),
  getPressedKeys: vi.fn(() => ['w']),
}));
import { controlMovementSystem } from '../src/systems/controlMovementSystem.js';
import { setControlTarget } from '../src/state/controlState.js';
import * as dbg from '../src/debug/debugState.js';

describe('movement responds after control target set', () => {
  it('moves forward when W and target set', () => {
    const obj = new THREE.Object3D();
    setControlTarget(obj, { allowFly:false, speed: 3 });
    controlMovementSystem(1.0);
    expect(obj.position.z).toBeLessThan(0);
    expect(dbg.getSnapshot().reason).toBe('moved');
  });
});
