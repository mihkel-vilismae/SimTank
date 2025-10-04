# Tank/Jet/Infantry Simulator — Starter (Vite + Three.js)

## This a an ancient version of the SimTank, I think the second iteration. This is not finished in any way, it is just a milestone in the development process of my SimTank game.

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


## Tank model
The Spawn Tank HUD action now creates a more detailed tank made of optimized primitives:
- **Hull:** layered boxes with a sloped glacis look
- **Turret:** low-profile dome + ring
- **Barrel:** long cylinder with a thicker muzzle piece
- **Running gear:** road wheels and thin track bands
- **Extras:** side skirts, hatch, antenna

Materials use `MeshStandardMaterial` (mid–low metalness, higher roughness) to read lighting nicely without textures.


### HUD: Toggle Tank/Cube
A single button in the World HUD group that switches the scene between the demo cube and the detailed tank.
- If a **tank** exists → it is removed and the **cube** is ensured to exist.
- Otherwise → the **cube** (if present) is removed and a **tank** is spawned.





### World HUD — Take Control
- **Take Control of Tank**: If a tank exists, focus camera on it. Otherwise, remove the cube (if present), spawn a tank, and focus it.
- **Take Control of Cube**: If a cube exists, focus camera on it. Otherwise, remove the tank (if present), spawn a cube, and focus it.


### Movement Controls
When you click **Take Control of Tank** or **Take Control of Cube**, you can move that entity:
- **Tank:** `W/A/S/D` on the ground plane (no vertical movement).
- **Cube:** `W/A/S/D` on the ground plane **and** `Q` (up) / `E` (down) for vertical flight.

Default speeds: Tank = 3 m/s, Cube = 4 m/s. (Adjustable in `setControlTarget` calls.)


### HUDs
- **Selected HUD** (bottom-right): shows name/position/speed/fly-capability of the currently selected object (tank or cube).
- **Button Info HUD** (top-left): toggle via the **SHOW BUTTON INFO** button in the Camera HUD; lists button labels and their actions.
