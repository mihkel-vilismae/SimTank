// tests/integration/camera_orbit_hud.test.js
import { describe, it, expect } from 'vitest';
import { createCameraHud } from '../../src/hud/CameraHud.js';

describe('CameraOrbitHUD', () => {
  it('renders world HUD and take-control buttons', () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    const ui = createCameraHud('hud-root', {});
    expect(ui).toBeTruthy();

    const root = document.getElementById('hud-root');
    expect(root).toBeTruthy();

    const world = document.getElementById('world-hud');
    expect(world).toBeTruthy();
    expect(document.getElementById('btn-take-control-tank')).toBeTruthy();
    expect(document.getElementById('btn-take-control-cube')).toBeTruthy();
  });
});
