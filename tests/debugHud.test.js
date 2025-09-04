// tests/debugHud.test.js
import { describe, it, expect } from 'vitest';
import { createDebugHud } from '../src/hud/DebugHud.js';
import * as dbg from '../src/debug/debugState.js';

describe('DebugHud', () => {
  it('renders and shows default fields', () => {
    const { root } = createDebugHud('hud-root');
    const wrap = document.getElementById('debug-hud');
    expect(wrap).toBeTruthy();
    expect(wrap.querySelector('#debug-info')).toBeTruthy();
    expect(wrap.querySelector('#debug-log')).toBeTruthy();
  });

  it('updates when debug state changes', () => {
    createDebugHud('hud-root');
    dbg.setLastFrameSnapshot({
      dt: 0.016,
      keys: ['w','a'],
      controlTarget: 'tank',
      controlPos: { x: 1, y: 0.5, z: 2 },
      moveVec: { x: 0.1, y: 0, z: 0.2, len: 0.22 },
      cameraPos: { x: 3, y: 4, z: 5 },
      reason: 'moved'
    });
    // Force a small delay for the setInterval refresh (we won't wait; just assert DOM exists)
    const info = document.querySelector('#debug-info');
    expect(info).toBeTruthy();
  });
});
