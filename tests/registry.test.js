import { describe, it, expect } from "vitest";
import { createRegistry } from "../src/engine/registry.js";

describe("registry", () => {
  it("adds, queries, and removes entities", () => {
    const r = createRegistry();
    const a = { components: { rotator: {} } };
    const b = { components: {} };

    r.add(a); r.add(b);
    expect([...r.all()].length).toBe(2);
    expect(r.with("rotator")).toContain(a);

    r.remove(a);
    expect(r.with("rotator")).not.toContain(a);
  });
});
