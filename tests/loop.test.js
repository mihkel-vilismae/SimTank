import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLoop } from "../src/engine/loop.js";

describe("createLoop", () => {
  let raf;
  beforeEach(() => {
    raf = global.requestAnimationFrame;
    global.requestAnimationFrame = (fn) => { fn(performance.now() + 16); return 1; };
  });
  afterEach(() => {
    global.requestAnimationFrame = raf;
  });

  it("renders frames and runs systems", () => {
    const render = vi.fn();
    const renderer = { render };
    const scene = {};
    const camera = {};
    const sys = vi.fn();

    const loop = createLoop({ renderer, scene, camera, systems: [sys] });
    loop.start();
    expect(render).toHaveBeenCalled();
    expect(sys).toHaveBeenCalled();
  });
});
