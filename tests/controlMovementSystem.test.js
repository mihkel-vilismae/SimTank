// tests/controlMovementSystem.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { controlMovementSystem } from '../src/systems/controlMovementSystem.js';
import { setControlTarget } from '../src/state/controlState.js';
import * as kb from '../src/input/keyboard.js';
import * as dbg from '../src/debug/debugState.js';

describe('controlMovementSystem', () => {
  beforeEach(() => {
    // Reset control target
    setControlTarget(null, { allowFly: false, speed: 3 });
  });

  it('records reason when no control target', () => {
    controlMovementSystem(0.016);
    const snap = dbg.getSnapshot();
    expect(snap.reason).toBe('no control target');
  });

  it('records reason when no input', () => {
    const obj = new THREE.Object3D();
    setControlTarget(obj, { allowFly: false, speed: 3 });
    controlMovementSystem(0.016);
    const snap = dbg.getSnapshot();
    expect(snap.reason).toBe('no input');
  });

  it('moves on WASD input', () => {
    const obj = new THREE.Object3D();
    setControlTarget(obj, { allowFly: false, speed: 3 });
    // simulate W pressed
    kb.initKeyboard();
    // Directly call internal pressed set if available is tricky; instead, monkeypatch isDown
    const original = kb.isDown;
    kb.isDown = (k) => k.toLowerCase() === 'w';
    controlMovementSystem(1.0); // 1 second
    kb.isDown = original;
    expect(obj.position.z).toBeLessThan(0); // moved forward (-Z)
    const snap = dbg.getSnapshot();
    expect(snap.reason).toBe('moved');
  });
});
