// src/input/keyboard.js
const pressed = new Set();

export function initKeyboard(){
  window.addEventListener('keydown', (e)=>{
    // avoid stealing focus from inputs
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    pressed.add(e.key.toLowerCase());
  });
  window.addEventListener('keyup', (e)=>{
    pressed.delete(e.key.toLowerCase());
  });
}

export function isDown(key){ return pressed.has(key.toLowerCase()); }
