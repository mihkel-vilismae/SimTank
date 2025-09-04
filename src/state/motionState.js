// src/state/motionState.js
const _store = new Map(); // uuid -> { lastPos: {x,y,z}, velocity: {x,y,z}, lastTime: number }

export function updateMotion(obj, dt){
  if (!obj || !obj.uuid || !obj.position) return;
  const rec = _store.get(obj.uuid) || { lastPos: {x: obj.position.x, y: obj.position.y, z: obj.position.z}, velocity: {x:0,y:0,z:0}, lastTime: 0 };
  const dx = obj.position.x - rec.lastPos.x;
  const dy = obj.position.y - rec.lastPos.y;
  const dz = obj.position.z - rec.lastPos.z;
  const v = dt > 0 ? { x: dx/dt, y: dy/dt, z: dz/dt } : rec.velocity;
  _store.set(obj.uuid, { lastPos: { x: obj.position.x, y: obj.position.y, z: obj.position.z }, velocity: v, lastTime: (rec.lastTime || 0) + dt });
}

export function getVelocity(obj){
  if (!obj || !obj.uuid) return { x:0,y:0,z:0 };
  const rec = _store.get(obj.uuid);
  return rec?.velocity || { x:0,y:0,z:0 };
}

export function resetMotion(obj){
  if (!obj || !obj.uuid) return;
  _store.delete(obj.uuid);
}
