import * as THREE from "three";

/**
 * Build a good-looking, performant tank composed of lightweight primitives.
 * - Hull: layered boxes with a sloped glacis look using transforms.
 * - Turret: low-profile dome + ring.
 * - Barrel: cylinder + thicker muzzle section.
 * - Wheels & Tracks: cylinders + thin track bands.
 * - Extras: side skirts, hatch, antenna.
 * 
 * Returns a THREE.Group named "tank".
 */
export function makeTankAppearance({
  colors = {
    hull: 0x4a5d3b,     // olive green
    turret: 0x3a4640,   // darker green/gray
    barrel: 0x2f3b36,
    skirt: 0x2b332e,
    wheels: 0x222222,
    tracks: 0x1a1a1a,
    details: 0x7c8b7a
  },
  scale = 1.0
} = {}) {
  const g = new THREE.Group();
  g.name = "tank";

  // Materials
  const std = (c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.25, roughness: 0.8 });
  const matHull   = std(colors.hull);
  const matTurret = std(colors.turret);
  const matBarrel = std(colors.barrel);
  const matSkirt  = std(colors.skirt);
  const matWheel  = std(colors.wheels);
  const matTrack  = new THREE.MeshStandardMaterial({ color: colors.tracks, metalness: 0.1, roughness: 0.95 });
  const matDet    = std(colors.details);

  // Helpers
  const add = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh; };

  // HULL (base + top + sloped glacis via skewed box)
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.3), matHull);
  base.position.set(0, 0.25, 0);
  add(base);

  const upper = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.1), matHull);
  upper.position.set(0, 0.68, 0);
  add(upper);

  // Fake sloped front by rotating a thin box
  const glacis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.12), matHull);
  glacis.position.set(-0.2, 0.66, 0);
  glacis.rotation.z = THREE.MathUtils.degToRad(-8);
  add(glacis);

  // SIDE SKIRTS
  const skirtL = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.25, 0.05), matSkirt);
  skirtL.position.set(0, 0.42,  0.68);
  add(skirtL);
  const skirtR = skirtL.clone();
  skirtR.position.z = -0.68;
  add(skirtR);

  // WHEELS (6 per side)
  const wheelGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 20);
  const wheelPositions = [-0.9, -0.54, -0.18, 0.18, 0.54, 0.9];
  for (const x of wheelPositions) {
    const wL = new THREE.Mesh(wheelGeom, matWheel);
    wL.rotation.z = Math.PI / 2;
    wL.position.set(x, 0.24, 0.62);
    add(wL);
    const wR = wL.clone();
    wR.position.z = -0.62;
    add(wR);
  }

  // TRACK BANDS (thin boxes that run along wheels)
  const trackL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.06), matTrack);
  trackL.position.set(0, 0.24, 0.62);
  add(trackL);
  const trackR = trackL.clone();
  trackR.position.z = -0.62;
  add(trackR);

  // TURRET RING + DOME
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 24), matDet);
  ring.position.set(0.2, 0.9, 0);
  add(ring);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), matTurret);
  dome.scale.set(1.1, 0.6, 1.0);
  dome.position.set(0.2, 1.05, 0);
  add(dome);

  // BARREL + MUZZLE
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16), matBarrel);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.95, 0.98, 0);
  add(barrel);

  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16), matBarrel);
  muzzle.rotation.z = Math.PI / 2;
  muzzle.position.set(1.7, 0.98, 0);
  add(muzzle);

  // HATCH
  const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 18), matDet);
  hatch.position.set(-0.05, 1.05, -0.18);
  add(hatch);

  // ANTENNA
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.8, 10), matDet);
  antenna.position.set(-0.6, 1.25, -0.25);
  add(antenna);

  // Center group and apply scale
  g.position.set(0, 0, 0);
  g.scale.setScalar(scale);

  return g;
}
