import * as THREE from "three";

export function makeCubeAppearance({ color = 0x00ff00, size = 1 } = {}) {
  const geom = new THREE.BoxGeometry(size, size, size);
  const mat = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = "Cube";
  return mesh;
}
