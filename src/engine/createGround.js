import * as THREE from "three";

/**
 * Adds a simple ground plane and a directional "sun" light with shadows.
 * Returns { ground, sun } for further customization if needed.
 */
export function createGround(scene, {
  size = 200,
  color = 0x808080,
  roughness = 1.0,
  metalness = 0.0,
  sunPosition = { x: 15, y: 25, z: 10 },
  sunIntensity = 1.1
} = {}) {
  // Ground
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = "Ground";
  scene.add(ground);

  // Directional light (sun)
  const sun = new THREE.DirectionalLight(0xffffff, sunIntensity);
  sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  // Tune shadow camera for better quality and coverage
  const cam = sun.shadow.camera;
  cam.near = 0.5;
  cam.far = 200;
  cam.left = -50;
  cam.right = 50;
  cam.top = 50;
  cam.bottom = -50;
  scene.add(sun);

  return { ground, sun };
}
