import { createRenderer } from "./engine/createRenderer.js";
import { createCamera } from "./engine/createCamera.js";
import { createScene } from "./engine/createScene.js";
import { addBasicLighting } from "./engine/createLighting.js";
import { createLoop } from "./engine/loop.js";
import { setupResize } from "./engine/resize.js";

const canvas = document.querySelector("#app");

// core building blocks
const renderer = createRenderer({ canvas });
const camera = createCamera({ aspect: window.innerWidth / window.innerHeight });
const { scene, updatables } = createScene();

// optional niceties
addBasicLighting(scene);

// resize & render loop
setupResize({ renderer, camera });
const loop = createLoop({ renderer, scene, camera, updatables });
loop.start();
