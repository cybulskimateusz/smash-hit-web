import { Delaunay } from 'd3-delaunay';

const getVoronoiCellsFromPoints = (
  points: CartesianCoordinates[],
  planeSize: Size2D
): Polygon[] => {
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([
    -planeSize.width / 2, -planeSize.height / 2,
    planeSize.width / 2, planeSize.height / 2
  ]);

  const cells: Polygon[] = [];

  for (const polygon of voronoi.cellPolygons()) {
    cells.push(polygon as Polygon);
  }

  return cells;
};

export default getVoronoiCellsFromPoints;
