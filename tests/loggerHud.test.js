// tests/loggerHud.test.js
import { describe, it, expect } from 'vitest';
import { createLoggerHud } from '../src/hud/LoggerHud.js';
import { addLog, toggleLogger, isLoggerEnabled, getLatest } from '../src/logger/loggerState.js';

describe('LoggerHUD', () => {
  it('renders and shows newest entries first with cap 100', () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    createLoggerHud('hud-root');
    for (let i=0;i<120;i++){ addLog('m'+i); }
    const el = document.getElementById('logger-log');
    const lines = el.textContent.trim().split(/\n+/);
    expect(lines[0]).toContain('m119'); // newest on top
    expect(getLatest(200).length).toBe(100); // capped
  });

  it('F2 toggle hides/shows', () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    const hud = createLoggerHud('hud-root');
    expect(hud.root.style.display).toBe(''); // default visible
    toggleLogger();
    expect(hud.root.style.display).toBe('none');
    toggleLogger();
    expect(hud.root.style.display).toBe('block'); // render loop sets it
  });
});
