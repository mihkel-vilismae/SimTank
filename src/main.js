import { config } from "./config.js";
import { createRenderer } from "./engine/createRenderer.js";
import { createCamera } from "./engine/createCamera.js";
import { createScene } from "./engine/createScene.js";
import { addBasicLighting } from "./engine/createLighting.js";
import { createLoop } from "./engine/loop.js";
import { setupResize } from "./engine/resize.js";
import { createGround } from "./engine/createGround.js";
import { createSky } from "./engine/createSky.js";

import { createRegistry } from "./engine/registry.js";
import { spawnCube } from "./world/spawnCube.js";
import { rotationSystem } from "./systems/rotationSystem.js";

const canvas = document.querySelector("#app");

const renderer = createRenderer({ canvas });
const camera = createCamera({ aspect: window.innerWidth / window.innerHeight });
const { scene } = createScene();

if (config.features.ambientLight) {
  addBasicLighting(scene);
}
if (config.features.ground) {
  createGround(scene, config.ground);
}
if (config.features.sky) {
  createSky(scene, config.sky);
}

const registry = createRegistry();
spawnCube({ scene, registry, at: { x: 0, y: 0.5, z: 0 } });

// wire systems (closure captures registry)
const systems = [ (dt) => rotationSystem(dt, registry) ];

setupResize({ renderer, camera });
const loop = createLoop({ renderer, scene, camera, systems });
loop.start();
