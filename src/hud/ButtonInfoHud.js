// src/hud/ButtonInfoHud.js
export function createButtonInfoHud(rootId = 'hud-root'){
  let root = document.getElementById(rootId);
  if (!root){
    root = document.createElement('div');
    root.id = rootId;
    document.body.appendChild(root);
  }
  const wrap = document.createElement('div');
  wrap.id = 'button-info-hud';
  root.appendChild(wrap);

  const title = document.createElement('div');
  title.className = 'hud-title';
  title.textContent = 'Button Info';
  wrap.appendChild(title);

  const list = document.createElement('ul');
  list.id = 'button-info-list';
  wrap.appendChild(list);

  const items = [
    ['SHOW BUTTON INFO', 'Toggle this Button Info HUD'],
    ['Orbit: On/Off',    'Enable/disable orbit controls'],
    ['Auto: On/Off',     'Toggle auto-rotate'],
    ['Zoom − / Zoom +',  'Zoom out / zoom in'],
    ['Pan: On/Off',      'Enable/disable panning'],
    ['Reset View',       'Reset camera pose'],
    ['Take Control of Tank', 'Spawn or select the tank and focus camera'],
    ['Take Control of Cube', 'Spawn or select the cube and focus camera'],
    ['F3',               'Toggle Debug HUD'],
    ['G',                'Toggle grid helper'],
    ['X',                'Toggle axes helper'],
  ];

  for (const [label, desc] of items){
    const li = document.createElement('li');
    li.innerHTML = `<strong>${label}</strong>: ${desc}`;
    list.appendChild(li);
  }

  function setVisible(v){
    wrap.style.display = v ? 'block' : 'none';
  }
  // start hidden by default
  setVisible(false);

  return { root: wrap, setVisible };
}
