// tests/cameraModeButton.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/camera/orbitControls.js', () => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  setPanEnabled: vi.fn(),
}));

import { createCameraHud } from '../src/hud/CameraHud.js';
import { getCameraMode } from '../src/state/cameraState.js';
import { getLatest } from '../src/logger/loggerState.js';

describe('Camera mode button', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-root"></div>';
  });

  it('cycles through modes and logs', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-camera-mode');
    expect(btn.textContent).toMatch(/Camera: Default/);
    btn.click();
    expect(getCameraMode()).toBe('lookAt');
    expect(getLatest(5).join('\n')).toMatch(/Camera mode: lookAt/);
    btn.click();
    expect(getCameraMode()).toBe('follow');
    btn.click();
    expect(getCameraMode()).toBe('followGun');
    btn.click();
    expect(getCameraMode()).toBe('default');
  });
});
