// src/hud/LoggerHud.js
import { onLog, getLatest, isLoggerEnabled } from '../logger/loggerState.js';

export function createLoggerHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){ root = document.createElement('div'); root.id = rootId; document.body.appendChild(root); }

  const wrap = document.createElement('div');
  wrap.id = 'logger-hud';
  root.appendChild(wrap);

  const header = document.createElement('div');
  header.className = 'debug-header';
  const title = document.createElement('span');
  title.textContent = 'LOGGER';
  header.appendChild(title);
  wrap.appendChild(header);

  const body = document.createElement('pre');
  body.id = 'logger-log';
  wrap.appendChild(body);

  function render(){
    wrap.style.display = isLoggerEnabled() ? 'block' : 'none';
    if (!isLoggerEnabled()) return;
    const lines = getLatest(10);
    body.textContent = lines.join('\n');
  }
  const off = onLog(()=>render());

  // periodic render in case
  const id = setInterval(render, 200);
  render();
  return { root: wrap, render, dispose(){ off(); clearInterval(id); wrap.remove(); } };
}
