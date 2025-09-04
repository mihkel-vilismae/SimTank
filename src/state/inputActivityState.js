// src/state/inputActivityState.js
const listeners = new Set();
const tokens = new Set();

function emit(){ for (const fn of listeners) try { fn(getTokens()); } catch {} }

export function onActivity(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function clearActivity(){
  tokens.clear();
  emit();
}

export function recordKey(key){
  if (!key) return;
  // only alphabet letters displayed in uppercase
  const k = String(key).length === 1 ? String(key).toUpperCase() : String(key);
  tokens.add(k);
  emit();
}

export function recordMouseClick(button){
  if (button === 0) tokens.add('left button clicked');
  else if (button === 1) tokens.add('middle button clicked');
  else if (button === 2) tokens.add('right button clicked');
  emit();
}

export function recordMouseDrag(button){
  if (button === 1) tokens.add('mouse dragged with middle mouse pressed');
  else if (button === 0) tokens.add('mouse dragged with left mouse pressed');
  else if (button === 2) tokens.add('mouse dragged with right mouse pressed');
  emit();
}

export function getTokens(){ return Array.from(tokens.values()); }
