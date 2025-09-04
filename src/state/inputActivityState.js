// src/state/inputActivityState.js
const listeners = new Set();
const activeKeys = new Set();      // 'Q', 'W', etc (uppercase)
const activeMouse = new Set();     // tokens for pressed mouse buttons
const activeDrags = new Set();     // tokens for current drags

function emit(){ for (const fn of listeners) try { fn(getTokens()); } catch {} }

export function onActivity(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setKeyActive(key, isActive){
  if (!key) return;
  const k = String(key).length === 1 ? String(key).toUpperCase() : String(key);
  if (isActive) activeKeys.add(k);
  else activeKeys.delete(k);
  emit();
}

export function setMouseButtonActive(button, isActive){
  const label = button === 0 ? 'left button pressed'
    : button === 1 ? 'middle button pressed'
    : button === 2 ? 'right button pressed'
    : `button ${button} pressed`;
  if (isActive) activeMouse.add(label);
  else activeMouse.delete(label);
  emit();
}

export function setMouseDragActive(button, isActive){
  const label = button === 1 ? 'mouse dragged with middle mouse pressed'
    : button === 0 ? 'mouse dragged with left mouse pressed'
    : button === 2 ? 'mouse dragged with right mouse pressed'
    : `mouse dragged with button ${button} pressed`;
  if (isActive) activeDrags.add(label);
  else activeDrags.delete(label);
  emit();
}

export function clearAll(){
  activeKeys.clear();
  activeMouse.clear();
  activeDrags.clear();
  emit();
}

export function getTokens(){
  // Order: keys first, then mouse, then drags
  return [...activeKeys.values(), ...activeMouse.values(), ...activeDrags.values()];
}
