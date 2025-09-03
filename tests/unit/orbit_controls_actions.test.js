import { describe, it, expect } from 'vitest';
import * as mod from '../../src/camera/orbitControls.js';
it('exposes zoom and pan helpers', () => {
  expect(typeof mod.zoomIn).toBe('function');
  expect(typeof mod.zoomOut).toBe('function');
  expect(typeof mod.setPanEnabled).toBe('function' || 'undefined'); // may be no-op if not initialized
});
