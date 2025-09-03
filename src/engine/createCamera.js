import * as THREE from "three";

export function createCamera({
  fov = 75,
  aspect = 1,
  near = 0.1,
  far = 1000,
  position = { x: 0, y: 0, z: 5 },
} = {}) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(position.x, position.y, position.z);
  return camera;
}
