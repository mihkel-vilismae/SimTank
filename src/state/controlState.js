// src/state/controlState.js
let _target = null;  // THREE.Object3D we control
let _config = { allowFly: false, speed: 3.0 }; // meters per second baseline

export function setControlTarget(object3D, config = {}){
  _target = object3D || null;
  _config = { ..._config, ...config };
}

export function getControlTarget(){
  return { target: _target, config: _config };
}

export function clearControlTarget(){
  _target = null;
}
