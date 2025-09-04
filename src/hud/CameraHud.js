// src/hud/CameraHud.js
import { getCameraState, toggleEnabled, toggleAutoRotate, resetPose, togglePan, setCameraMode, getCameraMode } from '../state/cameraState.js';
import { zoomIn, zoomOut, setPanEnabled } from '../camera/orbitControls.js';
import { addLog } from '../logger/loggerState.js';

/**
 * Small helper for consistent buttons.
 */
function button(label, onClick, { id, pressed = false } = {}){
  const b = document.createElement('button');
  if (id) b.id = id;
  b.textContent = label;
  b.className = pressed ? 'pressed' : '';
  b.addEventListener('click', (e)=>{ e.stopPropagation(); onClick?.(); });
  return b;
}

/**
 * Camera HUD
 * - Orbit toggle, Auto-rotate toggle
 * - Zoom − / Zoom +
 * - Pan toggle, Reset View
 * - Camera Mode dropdown: default | lookAt | follow | followGun
 * - Take Control of Tank / Cube
 * - SHOW BUTTON INFO (toggles ButtonInfoHUD and aligns it next to ActiveInputHUD)
 */
export function createCameraHud(rootId = 'hud-root', actions = {}){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }

  const wrap = document.createElement('div');
  wrap.id = 'camera-hud';
  root.appendChild(wrap);

  // --- Camera toggles ---
  const st = getCameraState();

  const orbitBtn = button(st.enabled ? 'Orbit: On' : 'Orbit: Off', () => {
    toggleEnabled();
    addLog('Orbit toggled');
    sync();
  }, { id: 'btn-orbit', pressed: st.enabled });

  const autoBtn = button(st.autoRotate ? 'Auto: On' : 'Auto: Off', () => {
    toggleAutoRotate();
    addLog('Auto toggled');
    sync();
  }, { id: 'btn-auto', pressed: st.autoRotate });

  const zoomOutBtn = button('Zoom −', () => { zoomOut(); addLog('Zoom − clicked'); }, { id: 'btn-zoom-out' });
  const zoomInBtn  = button('Zoom +', () => { zoomIn();  addLog('Zoom + clicked');  }, { id: 'btn-zoom-in' });

  const panBtn = button(st.panEnabled ? 'Pan: On' : 'Pan: Off', () => {
    togglePan();
    const s = getCameraState();
    setPanEnabled(s.panEnabled);
    addLog('Pan toggled');
    sync();
  }, { id: 'btn-pan', pressed: st.panEnabled });

  const resetBtn = button('Reset View', () => { resetPose(); addLog('Reset View clicked'); }, { id: 'btn-reset' });

  wrap.appendChild(orbitBtn);
  wrap.appendChild(autoBtn);
  wrap.appendChild(zoomOutBtn);
  wrap.appendChild(zoomInBtn);
  wrap.appendChild(panBtn);
  wrap.appendChild(resetBtn);

  // --- Camera Mode dropdown ---
  const modeWrap = document.createElement('div');
  modeWrap.className = 'mode-wrap';
  const modeLabel = document.createElement('label');
  modeLabel.textContent = 'Camera Mode: ';
  modeLabel.setAttribute('for', 'camera-mode-select');
  const modeSelect = document.createElement('select');
  modeSelect.id = 'camera-mode-select';
  ['default','lookAt','follow','followGun'].forEach(mode => {
    const opt = document.createElement('option');
    opt.value = mode;
    opt.textContent = mode === 'default' ? 'Default' : mode === 'lookAt' ? 'Look At' : mode === 'follow' ? 'Follow' : 'Follow Gun';
    modeSelect.appendChild(opt);
  });
  modeSelect.addEventListener('change', () => {
    setCameraMode(modeSelect.value);
    addLog('Camera mode: ' + modeSelect.value);
    sync();
  });
  modeWrap.appendChild(modeLabel);
  modeWrap.appendChild(modeSelect);
  wrap.appendChild(modeWrap);

  // --- World HUD group: control actions ---
  const worldGroup = document.createElement('div');
  worldGroup.className = 'hud-group';
  worldGroup.id = 'world-hud';

  const takeTankBtn = button('Take Control of Tank', () => {
    if (typeof actions.takeControlTank === 'function') actions.takeControlTank();
    addLog('Take Control of Tank clicked');
  }, { id: 'btn-take-control-tank' });

  const takeCubeBtn = button('Take Control of Cube', () => {
    if (typeof actions.takeControlCube === 'function') actions.takeControlCube();
    addLog('Take Control of Cube clicked');
  }, { id: 'btn-take-control-cube' });

  worldGroup.append(takeTankBtn, takeCubeBtn);
  wrap.appendChild(worldGroup);

  // --- Button Info toggle at the end (aligns next to ActiveInputHUD) ---
  const btnInfo = button('SHOW BUTTON INFO', () => {
    if (typeof actions.toggleButtonInfo === 'function') actions.toggleButtonInfo();
    // Try to align if the API is exposed
    const api = window.__buttonInfoApi;
    if (api && typeof api.alignButtonInfoWithActive === 'function') api.alignButtonInfoWithActive();
    addLog('Button Info HUD toggled');
  }, { id: 'btn-button-info-toggle' });
  wrap.appendChild(btnInfo);

  // Tip text
  const tip = document.createElement('div');
  tip.id = 'camera-tip';
  tip.textContent = 'Drag: orbit · Right-drag: pan · Wheel: zoom';
  wrap.appendChild(tip);

  function sync(){
    const s = getCameraState();
    orbitBtn.textContent = s.enabled ? 'Orbit: On' : 'Orbit: Off';
    orbitBtn.classList.toggle('pressed', s.enabled);

    autoBtn.textContent = s.autoRotate ? 'Auto: On' : 'Auto: Off';
    autoBtn.classList.toggle('pressed', s.autoRotate);

    panBtn.textContent = s.panEnabled ? 'Pan: On' : 'Pan: Off';
    panBtn.classList.toggle('pressed', s.panEnabled);

    const mode = getCameraMode && getCameraMode() || 'default';
    if (modeSelect && modeSelect.value !== mode) modeSelect.value = mode;
  }

  // Initial sync
  sync();

  return { root: wrap, sync };
}
