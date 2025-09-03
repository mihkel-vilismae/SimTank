import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { getCameraState } from '../../src/state/cameraState.js';
import { createCameraHud } from '../../src/hud/CameraHud.js';

describe('camera HUD', () => {
  it('renders buttons and toggles labels', () => {
    const dom = new JSDOM(`<!doctype html><html><body><div id="hud-root"></div></body></html>`);
    global.document = dom.window.document;
    const { root } = createCameraHud();
    const buttons = root.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    const [orbit, auto] = buttons;
    const prevOrbit = getCameraState().enabled;
    orbit.click();
    expect(orbit.textContent).toBe(prevOrbit ? 'Orbit: Off' : 'Orbit: On');
    orbit.click(); // restore
    const prevAuto = getCameraState().autoRotate;
    auto.click();
    expect(auto.textContent).toBe(prevAuto ? 'Auto: Off' : 'Auto: On');
  });
});
