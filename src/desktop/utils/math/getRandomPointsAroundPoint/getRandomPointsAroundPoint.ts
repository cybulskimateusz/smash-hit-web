import type { GetRandomPointsAroundProps } from '../getRandomPointsAround/getRandomPointsAround';
import getRandomPointsAround from '../getRandomPointsAround/getRandomPointsAround';

export interface GetRandomPointsAroundPointProps extends GetRandomPointsAroundProps {
  center?: [x: number, y: number];
}
/**
 * Generates random Cartesian points uniformly distributed within a circular ring.
 *
 * Points are sampled using polar coordinates and converted to Cartesian space.
 * The radius is chosen using a square-root distribution to ensure uniform
 * area density between the inner and outer radii.
 *
 * @param props - Configuration object
 * @param props.amount - Number of points to generate
 * @param props.outerRadius - Maximum radius from the origin
 * @param props.innerRadius - Optional minimum radius from the origin (defaults to 0)
 * @param props.center - Optional center of random points
 *
 * @returns An array of Cartesian coordinates `[x, y]`
 *
 * @example
 * getRandomPointsAround({ amount: 100, outerRadius: 50 });
 *
 * @example
 * getRandomPointsAround({ amount: 50, innerRadius: 20, outerRadius: 40 });
 *
 * @example
 * getRandomPointsAround({ amount: 50, innerRadius: 20, outerRadius: 40, center: [1, 1] });
 */
const getRandomPointsAroundPoint = (props: GetRandomPointsAroundPointProps): CartesianCoordinates[] => {
  let points = getRandomPointsAround(props);

  if (!props.center) return points;
  points = points.map(coordinate => [coordinate[0] + props.center![0], coordinate[1] + props.center![1]]);

  return points;
};

export default getRandomPointsAroundPoint;