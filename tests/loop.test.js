// tests/loop.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

let rafCb = null;
beforeEach(() => {
  rafCb = null;
  vi.useFakeTimers();
  global.requestAnimationFrame = (cb) => { rafCb = cb; return 1; };
  global.cancelAnimationFrame = vi.fn();
});

import { createLoop } from '../src/engine/loop.js';

describe('loop', () => {
  it('ticks systems when advanced manually', () => {
    let ticked = 0;
    const loop = createLoop({
      renderer: {},
      scene: {},
      camera: {},
      systems: [() => { ticked++; }],
    });

    loop.start();
    expect(typeof rafCb).toBe('function');

    // Advance two frames
    rafCb(16);
    rafCb(32);

    expect(ticked).toBe(2);
  });
});
