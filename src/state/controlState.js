// src/state/controlState.js
let _target = null;
let _config = { allowFly: false, speed: 3.0 };

const listeners = new Set();
function emit(){ for (const fn of listeners) try { fn({ target: _target, config: _config }); } catch {} }

export function onControlTargetChange(fn){ listeners.add(fn); return () => listeners.delete(fn); }

export function setControlTarget(object3D, config = {}){
  _target = object3D || null;
  _config = { ..._config, ...config };
  emit();
}

export function getControlTarget(){ return { target: _target, config: _config }; }
export function clearControlTarget(){ _target = null; emit(); }
