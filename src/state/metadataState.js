// src/state/metadataState.js
const _meta = new Map(); // uuid -> metadata object

export function setMetadata(obj, data){
  if (!obj || !obj.uuid) return;
  const prev = _meta.get(obj.uuid) || {};
  _meta.set(obj.uuid, { ...prev, ...data });
}

export function getMetadata(obj){
  if (!obj || !obj.uuid) return {};
  return _meta.get(obj.uuid) || {};
}

export function clearMetadata(obj){
  if (!obj || !obj.uuid) return;
  _meta.delete(obj.uuid);
}
