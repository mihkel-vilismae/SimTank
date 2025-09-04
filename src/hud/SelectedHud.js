// src/hud/SelectedHud.js
import { getControlTarget } from "../state/controlState.js";

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
    const canFly = !!config?.allowFly;
    info.textContent =
`name: ${name}
position: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})
speed: ${speed} m/s
allowFly: ${canFly ? 'yes' : 'no'}`;
  }

  // refresh
  const id = setInterval(render, 100);
  render();

  return { root: wrap, render, dispose(){ clearInterval(id); wrap.remove(); } };
}
