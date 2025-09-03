// src/state/cameraState.js
const listeners = new Set();

// Singleton camera state
const state = {
  enabled: true,
  autoRotate: false,
  enableDamping: true,
  dampingFactor: 0.08,
  minDistance: 2,
  maxDistance: 200,
  maxPolarAngle: Math.PI * 0.48,
  defaultPose: {
    position: { x: 0, y: 3, z: 6 },
    target:   { x: 0, y: 0, z: 0 }
  }
};

export function getCameraState() { return state; }
export function setEnabled(v){ state.enabled = !!v; emit(); }
export function toggleEnabled(){ state.enabled = !state.enabled; emit(); }
export function setAutoRotate(v){ state.autoRotate = !!v; emit(); }
export function toggleAutoRotate(){ state.autoRotate = !state.autoRotate; emit(); }
export function resetPose(){ emit({ type: "reset" }); }
export function onChange(cb){ listeners.add(cb); return () => listeners.delete(cb); }
function emit(payload){ for (const cb of listeners) try { cb(state, payload); } catch{} }


// Additional UI flags
state.panEnabled = false;
state.zoomStep = 0.8; // multiplier per click ( <1 zooms in, >1 zooms out when inverted appropriately )

export function togglePan(){ state.panEnabled = !state.panEnabled; emit(); }
export function setPan(v){ state.panEnabled = !!v; emit(); }
export function setZoomStep(v){ state.zoomStep = v; emit(); }
