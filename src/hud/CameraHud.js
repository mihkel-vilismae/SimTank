// src/hud/CameraHud.js
import { getCameraState, toggleEnabled, toggleAutoRotate, resetPose, togglePan } from '../state/cameraState.js';

function button(label, onClick, { id, pressed = false } = {}){
  const b = document.createElement('button');
  if (id) b.id = id;
  b.textContent = label;
  b.className = pressed ? 'pressed' : '';
  b.addEventListener('click', (e)=>{ e.stopPropagation(); onClick(); });
  return b;
}

import { zoomIn, zoomOut, setPanEnabled } from '../camera/orbitControls.js';
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

  
const zoomOutBtn = button('Zoom −', () => { zoomOut(); }, { id: 'btn-zoom-out' });
const zoomInBtn  = button('Zoom +', () => { zoomIn(); }, { id: 'btn-zoom-in' });
const panBtn = button('Pan: Off', () => { 
  togglePan(); 
  const s = getCameraState();
  setPanEnabled(s.panEnabled);
  sync();
}, { id: 'btn-pan', pressed: getCameraState().panEnabled });
const resetBtn = button('Reset View', () => resetPose(), { id: 'btn-reset' });

  wrap.appendChild(orbitBtn);
  wrap.appendChild(autoBtn);
  wrap.appendChild(zoomOutBtn);
    wrap.appendChild(zoomInBtn);
    wrap.appendChild(panBtn);
    wrap.appendChild(resetBtn);
  
const tip = document.createElement('div');
tip.id = 'camera-tip';
tip.textContent = 'Drag: orbit · Right-drag: pan · Wheel: zoom';
wrap.appendChild(tip);

    root.appendChild(wrap);

  function sync(){
    const s = getCameraState();
    orbitBtn.textContent = s.enabled ? 'Orbit: On' : 'Orbit: Off';
    autoBtn.textContent  = s.autoRotate ? 'Auto: On' : 'Auto: Off';
    orbitBtn.classList.toggle('pressed', s.enabled);
    autoBtn.classList.toggle('pressed', s.autoRotate);
      panBtn.textContent = s.panEnabled ? 'Pan: On' : 'Pan: Off';
      panBtn.classList.toggle('pressed', s.panEnabled);
  }
  // initial sync
  sync();
  return { root: wrap, sync };
}
