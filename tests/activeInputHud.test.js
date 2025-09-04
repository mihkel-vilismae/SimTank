// tests/activeInputHud.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { createActiveInputHud } from '../src/hud/ActiveInputHud.js';
import { initKeyboard } from '../src/input/keyboard.js';
import { initPointer } from '../src/input/pointer.js';

function text(){ return (document.getElementById('active-input-info')?.textContent || '').trim(); }

describe('ActiveInputHUD', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    createActiveInputHud('hud-root');
    initKeyboard();
    initPointer();
  });

  it('renders', () => {
    expect(document.getElementById('active-input-hud')).toBeTruthy();
  });

  it('displays Q when Q pressed', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(text()).toContain('Q');
  });

  it('displays left button while pressed, and clears on release', () => {
    window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
    expect(text()).toContain('left button pressed');
    window.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(text()).not.toContain('left button pressed');
  });

  it('displays W and drag-with-middle while active', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' })); // W
    window.dispatchEvent(new MouseEvent('mousedown', { button: 1 })); // middle down
    window.dispatchEvent(new MouseEvent('mousemove', { buttons: 4, clientX: 10, clientY: 10 })); // drag with middle
    const t = text();
    expect(t).toContain('W');
    expect(t).toContain('mouse dragged with middle mouse pressed');
    // release clears
    window.dispatchEvent(new MouseEvent('mouseup', { button: 1 }));
    window.dispatchEvent(new MouseEvent('mousemove', { buttons: 0 }));
    expect(text()).not.toContain('mouse dragged with middle mouse pressed');
  });

  it('displays only once per token (set semantics)', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    const lines = text().split(/\n+/).filter(Boolean).filter(s => s==='Q');
    expect(lines.length).toBe(1);
  });
});


  it('shows empty when nothing pressed', () => {
    expect(text()).toBe('');
  });
