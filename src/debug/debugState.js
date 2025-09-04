// src/debug/debugState.js
const MAX_LOG = 200;
let enabled = true;
let logs = [];
let last = {
  dt: 0, keys: [], moveVec: { x:0, y:0, z:0, len: 0 },
  reason: '', controlTarget: '(none)',
  controlPos: { x:0, y:0, z:0 },
  cameraPos: { x:0, y:0, z:0 }
};
export function isDebugEnabled(){ return enabled; }
export function setDebugEnabled(v){ enabled = !!v; }
export function toggleDebug(){ enabled = !enabled; }
export function pushLog(msg){ const t = new Date().toISOString().split('T')[1].split('.')[0]; logs.push(`[${t}] ${msg}`); if (logs.length > MAX_LOG) logs.shift(); }
export function getLogs(){ return logs; }
export function setLastFrameSnapshot(obj){ last = { ...last, ...obj }; }
export function getSnapshot(){ return last; }
