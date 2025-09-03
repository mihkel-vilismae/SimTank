// src/camera/orbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getCameraState, onChange } from '../state/cameraState.js';

let controls = null;
let cameraRef = null;

export function initOrbitControls(camera, domElement){
  const st = getCameraState();
  cameraRef = camera;
  controls = new OrbitControls(camera, domElement);
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
