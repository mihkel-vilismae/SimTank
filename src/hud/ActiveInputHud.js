// src/hud/ActiveInputHud.js
import { onActivity, getTokens } from '../state/inputActivityState.js';

export function createActiveInputHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.id = 'active-input-hud';
  root.appendChild(wrap);

  const title = document.createElement('div');
  title.className = 'hud-title';
  title.textContent = 'Active Input';
  wrap.appendChild(title);

  const body = document.createElement('pre');
  body.id = 'active-input-info';
  wrap.appendChild(body);

  const render = () => {
    const list = getTokens();
    body.textContent = list.length ? list.join('\n') : '';
  };

  const off = onActivity(render);
  render();

  return { root: wrap, render, dispose(){ off(); wrap.remove(); } };
}
