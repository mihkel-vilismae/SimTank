// src/input/pointer.js
import { recordMouseClick, recordMouseDrag } from '../state/inputActivityState.js';

let isDown = { 0:false, 1:false, 2:false };

export function initPointer(){
  window.addEventListener('mousedown', (e)=>{
    isDown[e.button] = true;
    recordMouseClick(e.button);
  });
  window.addEventListener('mouseup', (e)=>{
    isDown[e.button] = false;
  });
  window.addEventListener('mousemove', (e)=>{
    // If dragging with any held button
    if (e.buttons & 1) recordMouseDrag(0);
    if (e.buttons & 4) recordMouseDrag(1);
    if (e.buttons & 2) recordMouseDrag(2);
  });
}
