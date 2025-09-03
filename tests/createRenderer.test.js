import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createRenderer } from "../src/engine/createRenderer.js";

describe("createRenderer", () => {
  it("constructs WebGLRenderer and configures size and shadowMap", () => {
    const setPixelRatio = vi.fn();
    const setSize = vi.fn();
    const rendererStub = { setPixelRatio, setSize, shadowMap: {} };
    const ctor = vi.spyOn(THREE, "WebGLRenderer").mockImplementation(() => rendererStub);

    const canvas = { nodeName: "CANVAS" };
    const r = createRenderer({ canvas });

    expect(ctor).toHaveBeenCalled();
    expect(setPixelRatio).toHaveBeenCalled();
    expect(setSize).toHaveBeenCalled();
    expect(r.shadowMap.enabled).toBe(true);

    ctor.mockRestore();
  });
});
