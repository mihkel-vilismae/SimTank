// tests/createRenderer.test.js
import { describe, it, expect, vi } from 'vitest';

vi.mock('three', async () => {
  const actual = await vi.importActual<any>('three');
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      domElement: { nodeName: 'CANVAS' },
      render: vi.fn(),
    })),
  };
});

import { createRenderer } from '../src/engine/createRenderer.js';
import * as THREE from 'three';

describe('createRenderer', () => {
  it('constructs a WebGLRenderer', () => {
    const renderer = createRenderer();
    expect(THREE.WebGLRenderer).toHaveBeenCalledTimes(1);
    expect(renderer).toBeTruthy();
  });
});
