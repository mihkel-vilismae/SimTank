// src/camera/orbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getCameraState, onChange } from '../state/cameraState.js';

let controls = null;
let cameraRef = null;

export function initOrbitControls(camera, domElement){
  cameraRef = camera;
  controls = new OrbitControls(camera, domElement);
  const st = getCameraState();
  controls.enableDamping = st.enableDamping;
  controls.dampingFactor = st.dampingFactor;
  controls.minDistance = st.minDistance;
  controls.maxDistance = st.maxDistance;
  controls.maxPolarAngle = st.maxPolarAngle;
  controls.autoRotate = st.autoRotate;
  controls.enablePan = st.panEnabled;
  controls.enabled = st.enabled;

  onChange((s, payload)=>{
    controls.enabled = s.enabled;
    controls.autoRotate = s.autoRotate;
    controls.enablePan = s.panEnabled;
    if (payload && payload.type === 'reset'){
      camera.position.set(s.defaultPose.position.x, s.defaultPose.position.y, s.defaultPose.position.z);
      controls.target.set(s.defaultPose.target.x, s.defaultPose.target.y, s.defaultPose.target.z);
      controls.update();
    }
  });
}

export function updateOrbitControls(){
  if (controls) controls.update();
}

export function setPanEnabled(v){
  if (controls) controls.enablePan = !!v;
}

export function zoomIn(){
  const st = getCameraState();
  if (!controls) return;
  // OrbitControls dollyIn reduces distance (zooms in) with factor >1
  controls.dollyIn(st.zoomStep);
  controls.update();
}

export function zoomOut(){
  const st = getCameraState();
  if (!controls) return;
  // OrbitControls dollyOut increases distance (zooms out) with factor >1
  controls.dollyOut(st.zoomStep);
  controls.update();
}

export function focusOn(position){
  if (!controls || !position) return;
  controls.target.set(position.x, position.y, position.z);
  controls.update();
}

export function focusOnObject(obj){
  if (!obj) return;
  if (obj.position) focusOn(obj.position);
}
