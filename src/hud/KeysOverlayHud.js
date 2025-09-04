// src/hud/KeysOverlayHud.js
import { onActivity, getTokens } from '../state/inputActivityState.js';

const KEYS = ['W','A','S','D'];

export function createKeysOverlayHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.id = 'keys-overlay-hud';
  root.appendChild(wrap);

  const grid = document.createElement('div');
  grid.className = 'keys-grid';
  wrap.appendChild(grid);

  const cells = {};
  KEYS.forEach(k => {
    const c = document.createElement('div');
    c.className = 'key-cell';
    c.dataset.key = k;
    c.textContent = k;
    grid.appendChild(c);
    cells[k] = c;
  });

  function render(){
    const active = new Set(getTokens().filter(t => KEYS.includes(t)));
    KEYS.forEach(k => {
      cells[k].classList.toggle('active', active.has(k));
    });
  }

  const off = onActivity(render);
  render();
  return { root: wrap, render, dispose(){ off(); wrap.remove(); } };
}
