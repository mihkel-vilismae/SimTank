// tests/keyboard.test.js
import { describe, it, expect } from 'vitest';
import { initKeyboard, isDown, wasPressedOnce, getPressedKeys } from '../src/input/keyboard.js';

describe('keyboard exports', () => {
  it('has required functions', () => {
    expect(typeof initKeyboard).toBe('function');
    expect(typeof isDown).toBe('function');
    expect(typeof wasPressedOnce).toBe('function');
    expect(typeof getPressedKeys).toBe('function');
  });
});
