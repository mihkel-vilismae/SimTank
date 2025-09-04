// src/logger/loggerState.js
const MAX_LOG = 100;
let enabled = true; // visible by default, toggled with F2
const entries = []; // newest at index 0

const fmt = new Intl.DateTimeFormat('et-EE', {
  timeZone: 'Europe/Tallinn',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
});

function ts(){
  return fmt.format(new Date());
}

const listeners = new Set();
function emit(){ for (const fn of listeners) try{ fn(entries.slice(0, 10)); }catch{} }

export function onLog(fn){ listeners.add(fn); return () => listeners.delete(fn); }
export function getLatest(n = 10){ return entries.slice(0, n); }
export function isLoggerEnabled(){ return enabled; }
export function setLoggerEnabled(v){ enabled = !!v; emit(); }
export function toggleLogger(){ enabled = !enabled; emit(); }

export function addLog(message){
  const line = `[${ts()}] ${message}`;
  entries.unshift(line);
  if (entries.length > MAX_LOG) entries.length = MAX_LOG;
  emit();
}
