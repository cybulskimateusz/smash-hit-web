import getLinesFromPolygon from '@desktop/utils/math/getLinesFromPolygon/getLinesFromPolygon';
import getRandomPointsAroundPoint,
{ type GetRandomPointsAroundPointProps } from
  '@desktop/utils/math/getRandomPointsAroundPoint/getRandomPointsAroundPoint';
import getVoronoiCellsFromPoints from '@desktop/utils/math/getVoronoiCellsFromPoints/getVoronoiCellsFromPoints';
import * as THREE from 'three';

export interface GetExplosionMapProps extends GetRandomPointsAroundPointProps {
    planeSize: Size2D;
}
/**
 * Generates explosion map based on passed properties
 *
 * @param props - Configuration object
 * @param props.amount - Number of points to generate
 * @param props.outerRadius - Maximum radius from the origin
 * @param props.innerRadius - Optional minimum radius from the origin (defaults to 0)
 * @param props.center - Optional center of random points
 * @param props.planeSize - Size of the plane
 *
 * @returns A THREE.BufferAttribute of explosion map
 */
const getExplosionMap = (props: GetExplosionMapProps): THREE.BufferAttribute => {
  const points = getRandomPointsAroundPoint(props);
  const cells = getVoronoiCellsFromPoints(points, props.planeSize);
  const lines = [];

  for (const cell of cells) {
    const linesForCell = getLinesFromPolygon(cell);
    lines.push(...linesForCell);
  }

  return new THREE.BufferAttribute(new Float32Array(lines), 3);
};

export default getExplosionMap;