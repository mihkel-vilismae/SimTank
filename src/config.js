// Central game configuration
export const config = {
  features: {
    ground: true,
    sky: true,
    ambientLight: true,
  },
  ground: {
    size: 200,
    color: 0x808080,
  },
  sky: {
    sunPosition: { x: 15, y: 25, z: 10 },
    sunIntensity: 1.1,
  },
};
