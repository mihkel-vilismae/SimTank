import * as THREE from "three";

/**
 * Returns a THREE.Group containing a flat ground arrow mesh+outline.
 * Oriented to point along +Z in local space; we rotate the group on Y to match yaw.
 */
export function createDirectionArrowMesh({ color = 0x33ccff, scale = 5, yOffset = 0.02 } = {}) {
  const shape = new THREE.Shape();
  const tailW = 0.5, tailL = 1.2, headW = 1.8, headL = 1.8;
  shape.moveTo(-tailW, 0);
  shape.lineTo(tailW, 0);
  shape.lineTo(tailW, tailL);
  shape.lineTo(headW * 0.5, tailL);
  shape.lineTo(0, tailL + headL);
  shape.lineTo(-headW * 0.5, tailL);
  shape.lineTo(-tailW, tailL);
  shape.lineTo(-tailW, 0);

  const geom = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7, depthWrite: false });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = yOffset;
  mesh.scale.setScalar(scale);
  mesh.renderOrder = 10;

  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthWrite: false })
  );
  outline.rotation.x = mesh.rotation.x;
  outline.position.y = yOffset + 0.001;
  outline.scale.copy(mesh.scale);
  outline.renderOrder = 11;

  const group = new THREE.Group();
  group.add(mesh);
  group.add(outline);
  group.visible = true;
  return group;
}
