# Tank/Jet/Infantry Simulator — Starter (Vite + Three.js)

Minimal scaffold with an ECS-lite pattern (appearance, components, systems, spawners), a ground plane, ambient light, and a sun with shadows. Feature toggles centralized in `src/config.js`.

## Prerequisites
- Node.js 18+

## Install
```bash
npm install
```

## Run (dev server)
```bash
npx vite --open
```
Opens the app in your browser and serves `index.html` with ES modules.

## Test
```bash
npm test
```
Runs the Vitest suite in `tests/`.

## Coverage
```bash
npm run coverage
```
Generates coverage output (text summary + HTML report under `coverage/`).

## Project structure (key parts)
```
src/
  config.js                  # feature toggles (ground, sky, ambientLight)
  main.js                    # thin orchestration/entry
  engine/
    createRenderer.js        # renderer (shadows enabled)
    createCamera.js          # camera factory
    createScene.js           # scene container
    createLighting.js        # ambient light
    createGround.js          # ground plane
    createSky.js             # directional sun with shadows
    registry.js              # ECS-lite registry
    loop.js                  # render loop with systems
    resize.js                # resize handling
  entities/cube/
    makeCubeAppearance.js    # cube appearance (mesh only)
  components/
    rotator.js               # rotator component
  systems/
    rotationSystem.js        # rotates entities with rotator
  world/
    spawnCube.js             # spawns cube (appearance + components + registry)
tests/                       # one test per file + startup integration test
```

## Notes
- Toggle features and tweak parameters in `src/config.js` (e.g., ground size, sun intensity).
- The ECS-lite registry can be swapped out later for a full ECS without changing spawners/systems.


## Camera Controls
This project integrates Three.js OrbitControls.  
- Use mouse drag / wheel normally.  
- Use the on-screen HUD to toggle orbit, enable auto-rotate, reset camera, and zoom.


### HUD Controls
- **Orbit On/Off** — enable/disable OrbitControls.
- **Auto On/Off** — toggle auto rotation.
- **Zoom − / Zoom +** — discrete dolly steps.
- **Pan On/Off** — allows API panning; right-mouse drag still pans in OrbitControls.
- **Reset View** — snap to default pose.
Tip: Drag = orbit · Right-drag = pan · Wheel = zoom.
