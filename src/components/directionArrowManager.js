import * as THREE from "three";
import { createDirectionArrowMesh } from "../world/createDirectionArrowMesh.js";
import { yawFromQuaternion } from "../math/yawFromQuaternion.js";

/**
 * DirectionArrowManager
 * - Tracks any registry entity whose `components.directionArrow === true`
 * - Creates and positions a ground arrow group under each tracked entity
 * - Global enable/disable toggle
 */
export function createDirectionArrowManager({ scene, registry, color = 0x33ccff, scale = 5 } = {}) {
  const _map = new Map(); // entity -> arrowGroup
  let _enabled = true;

  function setEnabled(v) {
    _enabled = !!v;
    for (const g of _map.values()) g.visible = _enabled;
  }

  function toggle() { setEnabled(!_enabled); }

  function attach(entity) {
    if (!entity) return;
    if (!entity.components) entity.components = {};
    entity.components.directionArrow = true;
    ensureArrow(entity);
  }

  function detach(entity) {
    if (!entity) return;
    entity.components = entity.components || {};
    entity.components.directionArrow = false;
    const g = _map.get(entity);
    if (g) {
      scene && scene.remove(g);
      _map.delete(entity);
    }
  }

  function ensureArrow(entity) {
    if (_map.has(entity)) return _map.get(entity);
    const group = createDirectionArrowMesh({ color, scale });
    scene && scene.add(group);
    _map.set(entity, group);
    return group;
  }

  function updateOne(entity) {
    const use = entity?.components?.directionArrow;
    let group = _map.get(entity);
    if (use) {
      if (!group) group = ensureArrow(entity);
      const wq = new THREE.Quaternion();
      const wp = new THREE.Vector3();
      entity.getWorldQuaternion(wq);
      entity.getWorldPosition(wp);
      const yaw = yawFromQuaternion(wq);
      group.position.set(wp.x, group.position.y, wp.z);
      group.rotation.set(0, yaw, 0);
      group.visible = _enabled;
    } else {
      if (group) {
        scene && scene.remove(group);
        _map.delete(entity);
      }
    }
  }

  function update() {
    if (!registry) return;
    for (const entity of registry.all()) {
      updateOne(entity);
    }
  }

  return { setEnabled, toggle, attach, detach, update };
}
