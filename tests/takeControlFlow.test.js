// tests/takeControlFlow.test.js
import { describe, it, expect, vi } from 'vitest';
import { createCameraHud } from '../src/hud/CameraHud.js';
import { getControlTarget } from '../src/state/controlState.js';

// mock spawners and focus
vi.mock('../src/world/spawnTank.js', () => ({ spawnTank: vi.fn(() => ({ name: 'tank', position: { x:0,y:0,z:0 }, uuid: 't1' })) }));
vi.mock('../src/world/spawnCube.js', () => ({ spawnCube: vi.fn(() => ({ name: 'cube', position: { x:0,y:0,z:0 }, uuid: 'c1' })) }));
vi.mock('../src/camera/orbitControls.js', () => ({ focusOnObject: vi.fn(), zoomIn: vi.fn(), zoomOut: vi.fn(), setPanEnabled: vi.fn() }));
// minimal registry & scene
const registry = { findByName: (n) => null };
const scene = {};

describe('take control via HUD buttons', () => {
  it('take control of tank spawns and sets target', async () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    const actions = {
      takeControlTank: () => {
        const { spawnTank } = require('../src/world/spawnTank.js');
        const { setControlTarget } = require('../src/state/controlState.js');
        const { focusOnObject } = require('../src/camera/orbitControls.js');
        const t = spawnTank({ scene, registry, at: { x:0,y:0,z:0 } });
        setControlTarget(t, { allowFly:false, speed:3 });
        focusOnObject(t);
      },
      takeControlCube: () => {}
    };
    createCameraHud('hud-root', actions);
    document.getElementById('btn-take-control-tank').click();
    const st = getControlTarget();
    expect(st.target && st.target.name).toBe('tank');
  });

  it('take control of cube spawns and sets target', async () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    const actions = {
      takeControlTank: () => {},
      takeControlCube: () => {
        const { spawnCube } = require('../src/world/spawnCube.js');
        const { setControlTarget } = require('../src/state/controlState.js');
        const { focusOnObject } = require('../src/camera/orbitControls.js');
        const c = spawnCube({ scene, registry, at: { x:0,y:0,z:0 } });
        setControlTarget(c, { allowFly:true, speed:4 });
        focusOnObject(c);
      }
    };
    createCameraHud('hud-root', actions);
    document.getElementById('btn-take-control-cube').click();
    const st = getControlTarget();
    expect(st.target && st.target.name).toBe('cube');
  });
});
