// src/input/pointer.js
import { setMouseButtonActive, setMouseDragActive } from '../state/inputActivityState.js';
import { updateFromMouseEvent } from '../state/pointerState.js';

let isDown = { 0:false, 1:false, 2:false };

export function initPointer(){
  window.addEventListener('mousedown', (e)=>{
    isDown[e.button] = true;
    setMouseButtonActive(e.button, true);
  });
  window.addEventListener('mouseup', (e)=>{
    isDown[e.button] = false;
    setMouseButtonActive(e.button, false);
    setMouseDragActive(e.button, false);
  });
  window.addEventListener('mousemove', (e)=>{
    updateFromMouseEvent(e);
    setMouseDragActive(0, !!(e.buttons & 1));
    setMouseDragActive(1, !!(e.buttons & 4));
    setMouseDragActive(2, !!(e.buttons & 2));
  });
}
