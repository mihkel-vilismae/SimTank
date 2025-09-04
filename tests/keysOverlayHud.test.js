// tests/keysOverlayHud.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { createKeysOverlayHud } from '../src/hud/KeysOverlayHud.js';
import { initKeyboard } from '../src/input/keyboard.js';

function cell(k){ return document.querySelector(`.key-cell[data-key="${k}"]`); }

describe('KeysOverlayHud', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    createKeysOverlayHud('hud-root');
    initKeyboard();
  });

  it('renders Q W E / A S D / Shift Space cells', () => {
    expect(cell('Q')).toBeTruthy();
    expect(cell('W')).toBeTruthy();
    expect(cell('E')).toBeTruthy();
    expect(cell('A')).toBeTruthy();
    expect(cell('S')).toBeTruthy();
    expect(cell('D')).toBeTruthy();
    expect(cell('Shift')).toBeTruthy();
    expect(cell('Space')).toBeTruthy();
  });

  it('activates W on keydown and deactivates on keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    expect(cell('W').classList.contains('active')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
    expect(cell('W').classList.contains('active')).toBe(false);
  });

  it('supports multiple keys (A + D)', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    expect(cell('A').classList.contains('active')).toBe(true);
    expect(cell('D').classList.contains('active')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }));
    expect(cell('A').classList.contains('active')).toBe(false);
    expect(cell('D').classList.contains('active')).toBe(false);
  });
});


  it('activates Shift on keydown and deactivates on keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    expect(cell('Shift').classList.contains('active')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
    expect(cell('Shift').classList.contains('active')).toBe(false);
  });

  it('activates Space on keydown (key: " ") and deactivates on keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(cell('Space').classList.contains('active')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    expect(cell('Space').classList.contains('active')).toBe(false);
  });

  it('supports multi-key combo: Q + E + Shift', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    expect(cell('Q').classList.contains('active')).toBe(true);
    expect(cell('E').classList.contains('active')).toBe(true);
    expect(cell('Shift').classList.contains('active')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'q' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
    expect(cell('Q').classList.contains('active')).toBe(false);
    expect(cell('E').classList.contains('active')).toBe(false);
    expect(cell('Shift').classList.contains('active')).toBe(false);
  });
