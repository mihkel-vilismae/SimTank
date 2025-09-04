// tests/cameraModeDropdown.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { createCameraHud } from '../src/hud/CameraHud.js';
import { getCameraMode } from '../src/state/cameraState.js';

describe('Camera Mode dropdown', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-root"></div>';
  });

  it('reflects state and changes mode on selection', () => {
    createCameraHud('hud-root', {});
    const sel = document.getElementById('camera-mode-select');
    expect(sel).toBeTruthy();
    expect(sel.value).toBe('default');
    sel.value = 'follow';
    sel.dispatchEvent(new Event('change'));
    expect(getCameraMode()).toBe('follow');
  });
});
