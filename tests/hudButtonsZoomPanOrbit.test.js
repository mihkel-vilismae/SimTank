// tests/hudButtonsZoomPanOrbit.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/camera/orbitControls.js', () => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  setPanEnabled: vi.fn(),
  updateOrbitControls: vi.fn(),
}));

import { createCameraHud } from '../src/hud/CameraHud.js';
import * as orbit from '../src/camera/orbitControls.js';
import { getCameraState, toggleEnabled, toggleAutoRotate, togglePan } from '../src/state/cameraState.js';

describe('HUD buttons call orbit control functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    // normalize state
    const st = getCameraState();
    if (!st.enabled) toggleEnabled();
    if (st.autoRotate) toggleAutoRotate();
    if (st.panEnabled) togglePan();
  });

  it('Zoom buttons and Pan toggle logics', () => {
    createCameraHud('hud-root', {});
    document.getElementById('btn-zoom-in').click();
    document.getElementById('btn-zoom-out').click();
    const pan = document.getElementById('btn-pan');
    pan.click(); // toggles
    expect(orbit.zoomIn).toHaveBeenCalled();
    expect(orbit.zoomOut).toHaveBeenCalled();
    expect(orbit.setPanEnabled).toHaveBeenCalledWith(getCameraState().panEnabled);
  });
});
