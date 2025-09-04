// tests/cameraButtonLogs.test.js
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/camera/orbitControls.js', () => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  setPanEnabled: vi.fn(),
}));

import { createCameraHud } from '../src/hud/CameraHud.js';
import { getLatest } from '../src/logger/loggerState.js';

describe('Camera buttons add logs', () => {
  it('logs on zoom in/out and reset', () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    createCameraHud('hud-root', {});
    document.getElementById('btn-zoom-in').click();
    document.getElementById('btn-zoom-out').click();
    document.getElementById('btn-reset').click();
    const latest = getLatest(10).join("\n");
    expect(latest).toMatch(/Zoom \+ clicked/);
    expect(latest).toMatch(/Zoom − clicked/);
    expect(latest).toMatch(/Reset View clicked/);
  });
});
