import getPolarToCartesian from '@desktop/utils/math/getPolarToCartesian/getPolarToCartesian';

export interface GetRandomPointsAroundProps {
  amount: number;
  outerRadius: number;
  innerRadius?: number;
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
 *
 * @returns An array of Cartesian coordinates `[x, y]`
 *
 * @throws {Error} If `innerRadius` is greater than `outerRadius`
 *
 * @example
 * getRandomPointsAround({ amount: 100, outerRadius: 50 });
 *
 * @example
 * getRandomPointsAround({ amount: 50, innerRadius: 20, outerRadius: 40 });
 */
const getRandomPointsAround = (props: GetRandomPointsAroundProps): CartesianCoordinates[] => {
  const innerRadius = props.innerRadius || 0;
  const points: CartesianCoordinates[] = [];

  if (props.outerRadius < innerRadius) 
    throw new Error('Inner radius exceeds outer radius. It may cause unexpected behaviour.');

  for (let i = 0; i < props.amount; i++) {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.sqrt(Math.random() * (props.outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2);

    points.push(getPolarToCartesian([randomRadius, randomAngle]));
  }

  return points;
};

export default getRandomPointsAround;