// tests/integration/hudButtons.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock orbit control functions BEFORE importing the HUD
vi.mock('../../src/camera/orbitControls.js', () => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  setPanEnabled: vi.fn(),
}));

import { createCameraHud } from '../../src/hud/CameraHud.js';
import { getCameraState, toggleEnabled, toggleAutoRotate, resetPose } from '../../src/state/cameraState.js';
import * as orbit from '../../src/camera/orbitControls.js';
import * as cameraState from '../../src/state/cameraState.js';

describe('Camera HUD buttons', () => {
  beforeEach(() => {
    // fresh DOM
    document.body.innerHTML = '<div id="hud-root"></div>';
    // normalize state
    const st = getCameraState();
    if (!st.enabled) toggleEnabled();
    if (st.autoRotate) toggleAutoRotate();
    if (st.panEnabled) { cameraState.togglePan(); }
  });

  it('Orbit toggles enabled', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-orbit');
    const before = getCameraState().enabled;
    btn.click();
    expect(getCameraState().enabled).toBe(!before);
    btn.click();
    expect(getCameraState().enabled).toBe(before);
  });

  it('Auto toggles autoRotate', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-auto');
    const before = getCameraState().autoRotate;
    btn.click();
    expect(getCameraState().autoRotate).toBe(!before);
    btn.click();
    expect(getCameraState().autoRotate).toBe(before);
  });

  it('Zoom − calls orbit.zoomOut', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-zoom-out');
    orbit.zoomOut.mockClear();
    btn.click();
    expect(orbit.zoomOut).toHaveBeenCalledTimes(1);
  });

  it('Zoom + calls orbit.zoomIn', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-zoom-in');
    orbit.zoomIn.mockClear();
    btn.click();
    expect(orbit.zoomIn).toHaveBeenCalledTimes(1);
  });

  it('Pan toggles state and calls setPanEnabled', () => {
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-pan');
    orbit.setPanEnabled.mockClear();

    const before = getCameraState().panEnabled;
    btn.click();
    expect(getCameraState().panEnabled).toBe(!before);
    expect(orbit.setPanEnabled).toHaveBeenCalledWith(getCameraState().panEnabled);

    btn.click();
    expect(getCameraState().panEnabled).toBe(before);
    expect(orbit.setPanEnabled).toHaveBeenCalledWith(getCameraState().panEnabled);
  });

  it('Reset View calls resetPose()', () => {
    // Spy on resetPose export
    const spy = vi.spyOn(cameraState, 'resetPose');
    createCameraHud('hud-root', {});
    const btn = document.getElementById('btn-reset');
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
