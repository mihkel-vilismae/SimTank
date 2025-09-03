import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();

  // Demo object to prove the pipeline works: spinning green cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Updatable contract: any object with a tick(delta) will be stepped by the loop
  cube.tick = (delta) => {
    cube.rotation.x += 0.8 * delta;
    cube.rotation.y += 0.6 * delta;
  };

  const updatables = [cube];

  return { scene, updatables };
}
