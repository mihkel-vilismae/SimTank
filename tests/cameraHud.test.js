// tests/cameraHud.test.js
import { describe, it, expect } from 'vitest';
import { createCameraHud } from '../src/hud/CameraHud.js';

describe('CameraHud', () => {
  it('exports createCameraHud with (rootId, actions)', () => {
    expect(typeof createCameraHud).toBe('function');
    const ui = createCameraHud('hud-root', {});
    expect(ui && typeof ui.sync).toBe('function');
    // world group exists
    const world = document.getElementById('world-hud');
    expect(world).toBeTruthy();
    // take control buttons
    expect(document.getElementById('btn-take-control-tank')).toBeTruthy();
    expect(document.getElementById('btn-take-control-cube')).toBeTruthy();
  });
});
