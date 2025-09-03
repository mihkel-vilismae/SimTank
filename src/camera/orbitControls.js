// src/camera/orbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getCameraState, onChange } from '../state/cameraState.js';

let controls = null;
let domRef = null;
let cameraRef = null;

export function initOrbitControls(camera, domElement){
  const st = getCameraState();
  cameraRef = camera;
  controls = new OrbitControls(camera, domElement);
  domRef = domElement;
  controls.enableDamping = st.enableDamping;
  controls.dampingFactor = st.dampingFactor;
  controls.minDistance = st.minDistance;
  controls.maxDistance = st.maxDistance;
  controls.maxPolarAngle = st.maxPolarAngle;
  controls.enabled = st.enabled;
  controls.autoRotate = st.autoRotate;

  // Listen for state changes
  onChange((state, payload) => {
    if (!controls) return;
    controls.enabled = state.enabled;
    controls.autoRotate = state.autoRotate;
    if (payload && payload.type === "reset") {
      const p = state.defaultPose.position;
      const t = state.defaultPose.target;
      camera.position.set(p.x, p.y, p.z);
      controls.target.set(t.x, t.y, t.z);
      controls.update();
    }
  });
  return controls;
}

export function getOrbitControls(){ return controls; }
export function updateOrbitControls(){ if (controls) controls.update(); }


// Zoom helpers: multiplicative dolly to camera for perspective
export function zoomIn(){
  if (!controls) return;
  if (controls.dollyIn) { controls.dollyIn( getZoomFactor() ); controls.update(); }
  else if (controls.object && controls.object.isPerspectiveCamera) { controls.object.position.multiplyScalar(0.95); }
}
export function zoomOut(){
  if (!controls) return;
  if (controls.dollyOut) { controls.dollyOut( getZoomFactor() ); controls.update(); }
  else if (controls.object && controls.object.isPerspectiveCamera) { controls.object.position.multiplyScalar(1.05); }
}
function getZoomFactor(){
  // three.js OrbitControls expects >1 for dollyIn; we invert using state.zoomStep
  const step = getCameraState().zoomStep || 0.8;
  return 1.0 / step; // e.g., 1/0.8 = 1.25
}
export function setPanEnabled(v){
  if (!controls) return;
  controls.enablePan = !!v;
  // Right mouse button panning always works in OrbitControls; enablePan gates API panning.
}
