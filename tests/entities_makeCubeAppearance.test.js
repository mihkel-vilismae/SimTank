import { describe, it, expect } from "vitest";
import { makeCubeAppearance } from "../src/entities/cube/makeCubeAppearance.js";

describe("entities/cube/makeCubeAppearance", () => {
  it("creates a mesh named Cube", () => {
    const mesh = makeCubeAppearance({ color: 0x123456, size: 2 });
    expect(mesh.name).toBe("Cube");
    expect(mesh.isMesh).toBe(true);
  });
});
