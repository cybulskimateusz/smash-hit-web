import * as THREE from 'three';

/**
 * Creates a box with beveled edges (cut corners).
 * Much lighter than RoundedBoxGeometry (~50 vertices vs ~600).
 */
export default function createChamferedBoxGeometry(
  width = 1,
  height = 1,
  depth = 1,
  bevel = 0.1
): THREE.BufferGeometry {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;
  const b = Math.min(bevel, hw, hh, hd);

  // 24 vertices: 8 corners × 3 faces meeting at each corner
  const vertices = [
    // Front face (z+)
    -hw + b, -hh, hd,      hw - b, -hh, hd,      hw, -hh + b, hd,
    hw, hh - b, hd,        hw - b, hh, hd,       -hw + b, hh, hd,
    -hw, hh - b, hd,       -hw, -hh + b, hd,

    // Back face (z-)
    hw - b, -hh, -hd,      -hw + b, -hh, -hd,    -hw, -hh + b, -hd,
    -hw, hh - b, -hd,      -hw + b, hh, -hd,     hw - b, hh, -hd,
    hw, hh - b, -hd,       hw, -hh + b, -hd,

    // Top face (y+)
    -hw + b, hh, hd,       hw - b, hh, hd,       hw, hh, hd - b,
    hw, hh, -hd + b,       hw - b, hh, -hd,      -hw + b, hh, -hd,
    -hw, hh, -hd + b,      -hw, hh, hd - b,

    // Bottom face (y-)
    -hw + b, -hh, -hd,     hw - b, -hh, -hd,     hw, -hh, -hd + b,
    hw, -hh, hd - b,       hw - b, -hh, hd,      -hw + b, -hh, hd,
    -hw, -hh, hd - b,      -hw, -hh, -hd + b,

    // Right face (x+)
    hw, -hh + b, hd,       hw, hh - b, hd,       hw, hh, hd - b,
    hw, hh, -hd + b,       hw, hh - b, -hd,      hw, -hh + b, -hd,
    hw, -hh, -hd + b,      hw, -hh, hd - b,

    // Left face (x-)
    -hw, -hh + b, -hd,     -hw, hh - b, -hd,     -hw, hh, -hd + b,
    -hw, hh, hd - b,       -hw, hh - b, hd,      -hw, -hh + b, hd,
    -hw, -hh, hd - b,      -hw, -hh, -hd + b,

    // Bevel corners (8 triangular faces at corners)
    // Front-top-right
    hw - b, hh, hd,        hw, hh - b, hd,       hw, hh, hd - b,
    // Front-top-left
    -hw, hh - b, hd,       -hw + b, hh, hd,      -hw, hh, hd - b,
    // Front-bottom-right
    hw, -hh + b, hd,       hw - b, -hh, hd,      hw, -hh, hd - b,
    // Front-bottom-left
    -hw + b, -hh, hd,      -hw, -hh + b, hd,     -hw, -hh, hd - b,
    // Back-top-right
    hw, hh - b, -hd,       hw - b, hh, -hd,      hw, hh, -hd + b,
    // Back-top-left
    -hw + b, hh, -hd,      -hw, hh - b, -hd,     -hw, hh, -hd + b,
    // Back-bottom-right
    hw - b, -hh, -hd,      hw, -hh + b, -hd,     hw, -hh, -hd + b,
    // Back-bottom-left
    -hw, -hh + b, -hd,     -hw + b, -hh, -hd,    -hw, -hh, -hd + b,
  ];

  const indices = [
    // Front face
    0, 1, 2, 0, 2, 7, 7, 2, 3, 7, 3, 6, 6, 3, 4, 6, 4, 5,
    // Back face
    8, 9, 10, 8, 10, 15, 15, 10, 11, 15, 11, 14, 14, 11, 12, 14, 12, 13,
    // Top face
    16, 17, 18, 16, 18, 23, 23, 18, 19, 23, 19, 22, 22, 19, 20, 22, 20, 21,
    // Bottom face
    24, 25, 26, 24, 26, 31, 31, 26, 27, 31, 27, 30, 30, 27, 28, 30, 28, 29,
    // Right face
    32, 33, 34, 32, 34, 39, 39, 34, 35, 39, 35, 38, 38, 35, 36, 38, 36, 37,
    // Left face
    40, 41, 42, 40, 42, 47, 47, 42, 43, 47, 43, 46, 46, 43, 44, 46, 44, 45,
    // Corner bevels
    48, 49, 50,
    51, 52, 53,
    54, 55, 56,
    57, 58, 59,
    60, 61, 62,
    63, 64, 65,
    66, 67, 68,
    69, 70, 71,
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
