import { describe, it, expect } from "vitest";
import { setupResize } from "../src/engine/resize.js";

describe("setupResize", () => {
  it("updates renderer size and camera aspect on resize", () => {
    const calls = [];
    const renderer = { setSize: (w, h) => calls.push(["size", w, h]) };
    const camera = { isPerspectiveCamera: true, updateProjectionMatrix() { calls.push(["proj"]); } };

    const dispose = setupResize({ renderer, camera });
    // Trigger a resize event
    window.dispatchEvent(new Event("resize"));
    dispose();

    // Should have at least one call to setSize and updateProjectionMatrix
    const hasSize = calls.some(c => c[0] === "size");
    const hasProj = calls.some(c => c[0] === "proj");
    expect(hasSize).toBe(true);
    expect(hasProj).toBe(true);
  });
});
