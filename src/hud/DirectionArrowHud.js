// Simple HUD button that toggles DirectionArrowManager
export function createDirectionArrowHud(rootId = 'hud-root', manager) {
  if (!manager) return;
  let root = document.getElementById(rootId);
  if (!root) {
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:900;display:flex;gap:8px;";
  const btn = document.createElement('button');
  btn.id = 'btn-toggle-dir-arrows';
  btn.textContent = 'Direction Arrows: On';
  btn.addEventListener('click', () => {
    manager.toggle();
    btn.textContent = btn.textContent.includes('On') ? 'Direction Arrows: Off' : 'Direction Arrows: On';
  });
  wrap.appendChild(btn);
  root.appendChild(wrap);

  // Also wire 'V' key as a shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v') btn.click();
  });

  return { root: wrap, button: btn };
}
