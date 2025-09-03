import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  // Keep the scene clean; no entities are created here.
  // You can set background or fog here if desired:
  // scene.background = new THREE.Color(0x0a0a0a);
  return { scene };
}
