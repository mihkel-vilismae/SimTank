// src/hud/CameraHud.js
import { getCameraState, toggleEnabled, toggleAutoRotate, resetPose } from '../state/cameraState.js';

function button(label, onClick, { id, pressed = false } = {}){
  const b = document.createElement('button');
  if (id) b.id = id;
  b.textContent = label;
  b.className = pressed ? 'pressed' : '';
  b.addEventListener('click', (e)=>{ e.stopPropagation(); onClick(); });
  return b;
}

export function createCameraHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.id = 'camera-hud';

  const st = getCameraState();
  const orbitBtn = button(st.enabled ? 'Orbit: On' : 'Orbit: Off', () => {
    toggleEnabled();
    sync();
  }, { id: 'btn-orbit', pressed: st.enabled });

  const autoBtn = button(st.autoRotate ? 'Auto: On' : 'Auto: Off', () => {
    toggleAutoRotate();
    sync();
  }, { id: 'btn-auto', pressed: st.autoRotate });

  const resetBtn = button('Reset View', () => resetPose(), { id: 'btn-reset' });

  wrap.appendChild(orbitBtn);
  wrap.appendChild(autoBtn);
  wrap.appendChild(resetBtn);
  root.appendChild(wrap);

  function sync(){
    const s = getCameraState();
    orbitBtn.textContent = s.enabled ? 'Orbit: On' : 'Orbit: Off';
    autoBtn.textContent  = s.autoRotate ? 'Auto: On' : 'Auto: Off';
    orbitBtn.classList.toggle('pressed', s.enabled);
    autoBtn.classList.toggle('pressed', s.autoRotate);
  }
  // initial sync
  sync();
  return { root: wrap, sync };
}
