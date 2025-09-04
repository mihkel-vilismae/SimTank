// src/hud/SelectedHud.js
import { getControlTarget } from "../state/controlState.js";
import { getVelocity } from "../state/motionState.js";
import { getMetadata } from "../state/metadataState.js";

export function createSelectedHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.id = 'selected-hud';
  root.appendChild(wrap);

  const title = document.createElement('div');
  title.className = 'hud-title';
  title.textContent = 'Selected Object';
  wrap.appendChild(title);

  const info = document.createElement('pre');
  info.id = 'selected-info';
  wrap.appendChild(info);

  function render(){
    const { target, config } = getControlTarget();
    if (!target){
      info.textContent = 'none selected';
      return;
    }
    const pos = target.position || { x:0, y:0, z:0 };
    const name = target.name || target.type || 'Object3D';
    const speed = (config?.speed ?? 0).toFixed(2);
    const vel = getVelocity(target);
    // orientation from Euler; yaw(Y), pitch(X), roll(Z)
    const e = target.rotation || { x:0, y:0, z:0 };
    const rad2deg = (r)=> r * 180 / Math.PI;
    const pitch = rad2deg(e.x);
    const yaw   = rad2deg(e.y);
    const roll  = rad2deg(e.z);
    const meta = getMetadata(target);
    const canFly = !!config?.allowFly;
    info.textContent =
`name: ${name}
position: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})
velocity: (${vel.x.toFixed(2)}, ${vel.y.toFixed(2)}, ${vel.z.toFixed(2)}) m/s
speed: ${speed} m/s
orientation (deg): yaw=${yaw.toFixed(1)} pitch=${pitch.toFixed(1)} roll=${roll.toFixed(1)}
allowFly: ${canFly ? 'yes' : 'no'}
metadata: ${JSON.stringify(meta)}`;
  }

  // refresh
  const id = setInterval(render, 100);
  render();

  return { root: wrap, render, dispose(){ clearInterval(id); wrap.remove(); } };
}
