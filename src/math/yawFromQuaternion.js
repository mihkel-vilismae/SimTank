import * as THREE from "three";

export function yawFromQuaternion(q) {
  const fwd = new THREE.Vector3(0, 0, 1);
  fwd.applyQuaternion(q);
  fwd.y = 0;
  if (fwd.lengthSq() === 0) return 0;
  fwd.normalize();
  return Math.atan2(fwd.x, fwd.z);
}
