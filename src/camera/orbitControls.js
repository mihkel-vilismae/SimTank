// src/camera/orbitControls.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getCameraState, onChange, getCameraMode } from '../state/cameraState.js';

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
  if (!controls) return;
  const mode = getCameraMode && getCameraMode();
  if (mode === 'follow' || mode === 'followGun'){
    const { target } = getControlTarget();
    if (target){
      const THREE = require('three');
      const pos = new THREE.Vector3();
      target.getWorldPosition(pos);
      const q = new THREE.Quaternion();
      target.getWorldQuaternion(q);
      const back = new THREE.Vector3(0, followHeight, followDistance); // behind is +Z in local, add height
      back.applyQuaternion(q);
      const camPos = pos.clone().add(back);
      cameraRef.position.copy(camPos);
      controls.target.copy(pos);
      controls.update();
      return;
    }
  }
  if (mode === 'lookAt'){
    const { target } = getControlTarget();
    if (target){ const THREE = require('three'); const pos = new THREE.Vector3(); target.getWorldPosition(pos); controls.target.copy(pos); }
  }
  // default just update
  controls.update();
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


import { getControlTarget } from '../state/controlState.js';

let followDistance = 6; // meters behind
let followHeight = 2;   // meters above

function getWorldPosition(obj, out){
  out = out || { x:0, y:0, z:0 };
  if (!obj || !obj.getWorldPosition){ return out; }
  const v = obj.getWorldPosition(new (require('three').Vector3)());
  return { x: v.x, y: v.y, z: v.z };
}

function getMuzzle(obj){
  if (!obj || !obj.traverse) return null;
  let found = null;
  obj.traverse((child) => {
    const n = (child.name||'').toLowerCase();
    if (n.includes('muzzle') || n.includes('gun') || n.includes('barrel')){ found = child; }
  });
  return found || obj;
}

export const __cameraFollowConfig = { distance: () => followDistance, height: () => followHeight };
