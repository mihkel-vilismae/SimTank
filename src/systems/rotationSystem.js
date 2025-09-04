export function rotationSystem(dt, registry) {
  for (const obj of registry.with("rotator")) {
    const { x, y, z } = obj.components.rotator.speed;
    obj.rotation.x += x * dt;
    obj.rotation.y -= y * dt;
    obj.rotation.z += z * dt;
  }
}
