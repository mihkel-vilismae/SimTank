import * as THREE from "three";
import { config } from "./config.js";
import { createRenderer } from "./engine/createRenderer.js";
import { createCamera } from "./engine/createCamera.js";
import { createScene } from "./engine/createScene.js";
import { addBasicLighting } from "./engine/createLighting.js";
import { createLoop } from "./engine/loop.js";
import { setupResize } from "./engine/resize.js";
import { createGround } from "./engine/createGround.js";
import { createSky } from "./engine/createSky.js";

import { createRegistry } from "./engine/registry.js";
import { spawnCube } from "./world/spawnCube.js";
import { spawnTank } from "./world/spawnTank.js";
import { rotationSystem } from "./systems/rotationSystem.js";
import { getCameraState } from "./state/cameraState.js";
import { initKeyboard, wasPressedOnce } from "./input/keyboard.js";
import { initPointer } from "./input/pointer.js";
import { createCameraHud } from "./hud/CameraHud.js";
import { createDebugHud } from "./hud/DebugHud.js";
import { createLoggerHud } from "./hud/LoggerHud.js";
import { createSelectedHud } from "./hud/SelectedHud.js";
import { createActiveInputHud } from "./hud/ActiveInputHud.js";
import { createKeysOverlayHud } from "./hud/KeysOverlayHud.js";
import { createButtonInfoHud } from "./hud/ButtonInfoHud.js";
import { controlMovementSystem } from "./systems/controlMovementSystem.js";
import { velocityTrackerSystem } from "./systems/velocityTrackerSystem.js";
import { initOrbitControls, updateOrbitControls, focusOnObject } from "./camera/orbitControls.js";
import { setLastFrameSnapshot, pushLog, toggleDebug } from "./debug/debugState.js";
import "./styles/hud.css";
import { setControlTarget } from "./state/controlState.js";
import { setMetadata } from "./state/metadataState.js";
import { addLog, toggleLogger } from "./logger/loggerState.js";
const canvas = document.querySelector("#app");

const renderer = createRenderer({ canvas });
const camera = createCamera({ aspect: window.innerWidth / window.innerHeight });
const { scene } = createScene();

// Helpers
const grid = new THREE.GridHelper(20, 20); grid.name = 'debug-grid'; scene.add(grid);
const axes = new THREE.AxesHelper(1.2); axes.position.set(0, 0.01, 0); axes.name = 'debug-axes'; scene.add(axes);

// Debug HUD
createDebugHud('hud-root'); addLog('Debug HUD shown');
// Selected HUD
createSelectedHud('hud-root'); addLog('Selected HUD shown');
// Button Info HUD
const buttonInfo = createButtonInfoHud('hud-root');
window.__buttonInfoApi = buttonInfo; // expose for alignment after toggle
const loggerHud = createLoggerHud('hud-root'); addLog('Logger HUD shown');
// Active Input HUD
createActiveInputHud('hud-root'); addLog('Active Input HUD shown');
createKeysOverlayHud('hud-root');


// Input
initKeyboard();
// Pointer
initPointer();

if (config.features.ambientLight) {
  addBasicLighting(scene);
}
if (config.features.ground) {
  createGround(scene, config.ground);
}
if (config.features.sky) {
  createSky(scene, config.sky);
}

function debugUpdateSystem(dt){
  const camPos = camera.position;
  setLastFrameSnapshot({ cameraPos: { x:camPos.x, y:camPos.y, z:camPos.z } });
  if (wasPressedOnce('f3')) { toggleDebug(); addLog('Debug HUD toggled'); }
  if (wasPressedOnce('f2')) { toggleLogger(); addLog('Logger HUD toggled'); }
  if (wasPressedOnce('g')) { const gh = scene.getObjectByName('debug-grid'); if (gh) gh.visible = !gh.visible; }
  if (wasPressedOnce('x')) { const ax = scene.getObjectByName('debug-axes'); if (ax) ax.visible = !ax.visible; }
}
const registry = createRegistry();
spawnCube({ scene, registry, at: { x: 0, y: 0.5, z: 0 } });

// wire systems (closure captures registry)
const systems = [ () => updateOrbitControls(), (dt) => debugUpdateSystem(dt),  (dt) => rotationSystem(dt, registry) ];

setupResize({ renderer, camera });
// === HUD actions wiring (added toggle) ===
const hudActions = {
  takeControlTank: () => {
    const tank = scene.getObjectByName('tank');
    if (tank) { setControlTarget(tank, { allowFly: false, speed: 3.0 }); setMetadata(tank, { health: 100, ammo: 30, type: 'tank' }); focusOnObject(tank); return; }
    const cube = scene.getObjectByName('demo-cube');
    if (cube) { scene.remove(cube); registry.remove(cube); }
    const t = spawnTank({ scene, registry, at: { x: 0, y: 0.5, z: 0 } });
    setControlTarget(t, { allowFly: false, speed: 3.0 });
    setMetadata(t, { health: 100, ammo: 30, type: 'tank' });
    focusOnObject(t);
  },
  toggleButtonInfo: () => {
    // toggle visibility of Button Info HUD
    const el = document.getElementById('button-info-hud');
    const visible = el && el.style.display !== 'none';
    if (el) el.style.display = visible ? 'none' : 'block';
  },
  takeControlCube: () => {
    const cube = scene.getObjectByName('demo-cube');
    if (cube) { setControlTarget(cube, { allowFly: true, speed: 4.0 }); setMetadata(cube, { health: 50, ammo: 0, type: 'cube' }); focusOnObject(cube); return; }
    const tank = scene.getObjectByName('tank');
    if (tank) { scene.remove(tank); registry.remove(tank); }
    const c = spawnCube({ scene, registry, at: { x: 0, y: 0.5, z: 0 } });
    setControlTarget(c, { allowFly: true, speed: 4.0 });
    setMetadata(c, { health: 50, ammo: 0, type: 'cube' });
    focusOnObject(c);
  }
};
createCameraHud('hud-root', hudActions);

const loop = createLoop({ renderer, scene, camera, systems });
loop.start();
