export function addRotator(target, { x = 0.8, y = 0.6, z = 0 } = {}) {
  target.components = target.components || {};
  target.components.rotator = { speed: { x, y, z } };
  return target;
}
