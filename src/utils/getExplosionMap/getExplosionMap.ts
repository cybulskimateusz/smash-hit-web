import * as THREE from 'three';

import getLinesFromPolygons from '../math/getLinesFromPolygons/getLinesFromPolygons';
import getRandomPointsAroundPoint,
{ type GetRandomPointsAroundPointProps } from '../math/getRandomPointsAroundPoint/getRandomPointsAroundPoint';
import getVoronoiCellsFromPoints from '../math/getVoronoiCellsFromPoints/getVoronoiCellsFromPoints';

export interface GetExplosionMapProps extends GetRandomPointsAroundPointProps {
    planeSize: Size2D;
}

const getExplosionMap = (props: GetExplosionMapProps): THREE.BufferAttribute => {
  const points = getRandomPointsAroundPoint(props);
  const cells = getVoronoiCellsFromPoints(points, props.planeSize);
  const lines = getLinesFromPolygons(cells);

  return new THREE.BufferAttribute(new Float32Array(lines), 3);
};

export default getExplosionMap;