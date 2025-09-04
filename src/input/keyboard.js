// src/input/keyboard.js
const pressed = new Set();

export function initKeyboard(){
  window.addEventListener('keydown', (e)=>{
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    pressed.add(e.key.toLowerCase());
  });
  window.addEventListener('keyup', (e)=>{
    pressed.delete(e.key.toLowerCase());
  });
}

export function isDown(key){ return pressed.has(key.toLowerCase()); }

// Single-tick press (useful for hotkeys like F3/G/X)
const justPressed = new Set();
window.addEventListener('keydown', (e)=>{
  const k = e.key.toLowerCase();
  justPressed.add(k);
  // clear on next tick so it's true only once
  setTimeout(()=>justPressed.delete(k), 0);
});

export function wasPressedOnce(key){ return justPressed.has(key.toLowerCase()); }
export function getPressedKeys(){ return Array.from(pressed.values()); }
