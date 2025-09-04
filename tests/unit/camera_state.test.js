import { describe, it, expect } from 'vitest';
import { getCameraState, toggleEnabled, toggleAutoRotate } from '../../src/state/cameraState.js';

describe('cameraState', () => {
  it('toggles enabled', () => {
    const st = getCameraState();
    const prev = st.enabled;
    toggleEnabled();
    expect(getCameraState().enabled).toBe(!prev);
    // restore
    toggleEnabled();
    expect(getCameraState().enabled).toBe(prev);
  });

  it('toggles autoRotate', () => {
    const st = getCameraState();
    const prev = st.autoRotate;
    toggleAutoRotate();
    expect(getCameraState().autoRotate).toBe(!prev);
    // restore
    toggleAutoRotate();
    expect(getCameraState().autoRotate).toBe(prev);
  });
});
