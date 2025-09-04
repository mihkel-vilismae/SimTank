// tests/setup.js
import { beforeEach } from 'vitest';

beforeEach(() => {
  // Reset document body before each test
  document.body.innerHTML = '<div id="hud-root"></div>';
});
