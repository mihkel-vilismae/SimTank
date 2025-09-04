// src/state/pointerState.js
// Tracks mouse position in both pixels and normalized device coordinates, plus a cached ray target.
const listeners = new Set();

const state = {
  clientX: 0,
  clientY: 0,
  ndcX: 0, // [-1..1]
  ndcY: 0, // [-1..1]
};

function emit(){ for (const fn of listeners) try { fn({ ...state }); } catch {} }

export function onPointerState(fn){ listeners.add(fn); return () => listeners.delete(fn); }

export function updateFromMouseEvent(e){
  state.clientX = e.clientX;
  state.clientY = e.clientY;
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  state.ndcX = (e.clientX / w) * 2 - 1;
  state.ndcY = -(e.clientY / h) * 2 + 1;
  emit();
}

export function getPointerState(){ return { ...state }; }
