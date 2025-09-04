// src/hud/DebugHud.js
import { isDebugEnabled, toggleDebug, getLogs, getSnapshot } from "../debug/debugState.js";
import { getCameraState } from "../state/cameraState.js";

export function createDebugHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){ root = document.createElement('div'); root.id = rootId; document.body.appendChild(root); }
  const wrap = document.createElement('div'); wrap.id = 'debug-hud'; root.appendChild(wrap);

  const header = document.createElement('div'); header.className = 'debug-header';
  const title = document.createElement('span'); title.textContent = 'DEBUG';
  const toggle = document.createElement('button'); toggle.textContent = 'F3: Toggle Debug'; toggle.addEventListener('click', ()=>{ toggleDebug(); render(); });
  header.appendChild(title); header.appendChild(toggle); wrap.appendChild(header);

  const info = document.createElement('pre'); info.id = 'debug-info'; wrap.appendChild(info);
  const log = document.createElement('pre'); log.id = 'debug-log'; wrap.appendChild(log);

  function render(){
    const visible = isDebugEnabled(); wrap.style.display = visible ? 'block' : 'none'; if (!visible) return;
    const s = getSnapshot(); const cs = getCameraState();
    info.textContent =
`dt: ${s.dt.toFixed(4)} s
keys: ${s.keys.join(' ')}
controlTarget: ${s.controlTarget}
targetPos: (${s.controlPos.x.toFixed(2)}, ${s.controlPos.y.toFixed(2)}, ${s.controlPos.z.toFixed(2)})
moveVec: (${s.moveVec.x.toFixed(2)}, ${s.moveVec.y.toFixed(2)}, ${s.moveVec.z.toFixed(2)}) len=${s.moveVec.len.toFixed(2)}
reason: ${s.reason || '-'}
cameraPos: (${s.cameraPos.x.toFixed(2)}, ${s.cameraPos.y.toFixed(2)}, ${s.cameraPos.z.toFixed(2)})
orbit: enabled=${cs.enabled} auto=${cs.autoRotate} pan=${cs.panEnabled}`;
    log.textContent = getLogs().slice(-20).join('\n');
  }
  setInterval(render, 100); render();
  return { root: wrap, render };
}
