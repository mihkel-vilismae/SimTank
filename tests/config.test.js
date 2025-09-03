import { describe, it, expect } from "vitest";
import { config } from "../src/config.js";

describe("config", () => {
  it("has expected feature toggles", () => {
    expect(config.features).toBeDefined();
    expect(Object.keys(config.features)).toEqual(
      expect.arrayContaining(["ground", "sky", "ambientLight"])
    );
  });
});
