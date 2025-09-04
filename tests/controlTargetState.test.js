// tests/controlTargetState.test.js
import { describe, it, expect } from 'vitest';
import { setControlTarget, getControlTarget, clearControlTarget, onControlTargetChange } from '../src/state/controlState.js';

class Dummy { constructor(){ this.uuid = Math.random().toString(36).slice(2); this.position = { x:0,y:0,z:0 }; this.name='dummy'; } }

describe('controlState', () => {
  it('sets and clears control target and emits', () => {
    let fired = 0;
    const off = onControlTargetChange(({ target, config }) => { fired++; });
    const obj = new Dummy();
    setControlTarget(obj, { speed: 5, allowFly: true });
    const st = getControlTarget();
    expect(st.target).toBe(obj);
    expect(st.config.speed).toBe(5);
    expect(st.config.allowFly).toBe(true);
    clearControlTarget();
    expect(getControlTarget().target).toBe(null);
    off();
    expect(fired).toBeGreaterThanOrEqual(2);
  });
});
