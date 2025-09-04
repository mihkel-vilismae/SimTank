// src/state/cameraState.js
const listeners = new Set();

const state = {
  cameraMode: 'default',
  enabled: true,
  autoRotate: false,
  enableDamping: true,
  dampingFactor: 0.08,
  minDistance: 2,
  maxDistance: 200,
  maxPolarAngle: Math.PI * 0.48,
  panEnabled: false,
  zoomStep: 1.2, // dolly factor per click
  defaultPose: {
    position: { x: 0, y: 3, z: 6 },
    target:   { x: 0, y: 0, z: 0 }
  }
};

function emit(payload){ for (const cb of listeners) try { cb(state, payload); } catch{} }

export function onChange(cb){ listeners.add(cb); return () => listeners.delete(cb); }
export function getCameraState(){ return state; }

export function toggleEnabled(){ state.enabled = !state.enabled; emit(); }
export function setEnabled(v){ state.enabled = !!v; emit(); }

export function toggleAutoRotate(){ state.autoRotate = !state.autoRotate; emit(); }
export function setAutoRotate(v){ state.autoRotate = !!v; emit(); }

export function togglePan(){ state.panEnabled = !state.panEnabled; emit(); }
export function setPanEnabled(v){ state.panEnabled = !!v; emit(); }

export function setZoomStep(v){ state.zoomStep = v; emit(); }

export function resetPose(){ emit({ type: "reset" }); }

export function setCameraMode(mode){ state.cameraMode = mode; emit({ type: 'mode' }); }
export function getCameraMode(){ return state.cameraMode; }
