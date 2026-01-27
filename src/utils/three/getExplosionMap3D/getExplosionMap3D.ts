import getRandomPointsAroundPoint,
{ type GetRandomPointsAroundPointProps } from '@src/utils/math/getRandomPointsAroundPoint/getRandomPointsAroundPoint';
import getVoronoiCellsFromPoints from '@src/utils/math/getVoronoiCellsFromPoints/getVoronoiCellsFromPoints';
import * as THREE from 'three';

export interface GetExplosionMapProps extends GetRandomPointsAroundPointProps {
    boxSize: THREE.Vector3;
}
/**
 * Generates explosion map based on passed properties
 *
 * @param props - Configuration object
 * @param props.amount - Number of points to generate
 * @param props.outerRadius - Maximum radius from the origin
 * @param props.innerRadius - Optional minimum radius from the origin (defaults to 0)
 * @param props.center - Optional center of random points
 * @param props.boxSize - THREE.Vector3
 *
 * @returns A THREE.ExtrudeGeometry[] of explosion map
 */
const getExplosionMap3D = (props: GetExplosionMapProps): THREE.ExtrudeGeometry[] => {
  const points = getRandomPointsAroundPoint(props);
  const cells = getVoronoiCellsFromPoints(points, {
    width: props.boxSize.x,
    height: props.boxSize.y
  });
  
  const geometries: THREE.ExtrudeGeometry[] = [];

  for (const cell of cells) {
    const shape = new THREE.Shape();
    cell.forEach(([x, y], index) => {
      if (!index) shape.moveTo(x, y); 
      else shape.lineTo(x, y);
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: props.boxSize.z,
      bevelEnabled: false
    });

    geometries.push(geometry);
  }

  return geometries;
};

export default getExplosionMap3D;