export function addRotator(target, { x = 0.8, y = 0.6, z = 0 } = {}) {
  target.components = target.components || {};
  target.components.rotator = { speed: { x, y, z } };
  return target;
}


// Added OrbitControls integration
import { initOrbitControls, updateOrbitControls } from '../camera/orbitControls.js';
import { createCameraHud } from '../hud/CameraHud.js';

export function setupCameraControls(camera, renderer) {
  const controls = initOrbitControls(camera, renderer.domElement);
  createCameraHud();
  return controls;
}

export function updateCameraControls() {
  updateOrbitControls();
}
