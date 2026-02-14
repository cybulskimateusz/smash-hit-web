/**
 * Converts polar coordinates to cartesian coordinates.
 * @param polar - Tuple [r, θ] where r = radius, θ = angle in radians
 * @returns Cartesian coordinates [x, y]
 */
const getPolarToCartesian = (polar: PolarCoordinates): CartesianCoordinates =>
  [Math.cos(polar[1]) * polar[0], Math.sin(polar[1]) * polar[0]];

export default getPolarToCartesian;
