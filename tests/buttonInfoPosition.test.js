// tests/buttonInfoPosition.test.js
import { describe, it, expect } from 'vitest';
import { createActiveInputHud } from '../src/hud/ActiveInputHud.js';
import { createButtonInfoHud } from '../src/hud/ButtonInfoHud.js';

describe('ButtonInfoHUD positioning', () => {
  it('positions to the right of ActiveInputHUD', () => {
    document.body.innerHTML = '<div id="hud-root"></div>';
    const active = createActiveInputHud('hud-root').root;
    // mock bounding box
    active.getBoundingClientRect = () => ({ left: 10, top: 20, width: 250, height: 80, right:260, bottom:100 });
    const api = createButtonInfoHud('hud-root');
    api.alignButtonInfoWithActive();
    const wrap = api.root;
    expect(wrap.style.left).toBe((10+250+12) + 'px');
    expect(wrap.style.top).toBe('20px');
  });
});
