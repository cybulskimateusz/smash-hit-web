import getPolarToCartesian from './getPolarToCartesian';

/**
 * toBeCloseTo is necessarry due to the way JS handles floating points
 */
describe('getPolarToCartesian', () => {
  it('should convert polar origin to cartesian origin', () => {
    const result = getPolarToCartesian([0, 0]);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0);
  });

  it('should convert r=1, theta=0 to (1, 0)', () => {
    const result = getPolarToCartesian([1, 0]);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(0);
  });

  it('should convert r=1, theta=PI/2 to (0, 1)', () => {
    const result = getPolarToCartesian([1, Math.PI / 2]);
    expect(result[0]).toBeCloseTo(0);
    expect(result[1]).toBeCloseTo(1);
  });

  it('should convert r=1, theta=PI to (-1, 0)', () => {
    const result = getPolarToCartesian([1, Math.PI]);
    expect(result[0]).toBeCloseTo(-1);
    expect(result[1]).toBeCloseTo(0);
  });

  it('should convert r=2, theta=PI/4 to (sqrt(2), sqrt(2))', () => {
    const result = getPolarToCartesian([2, Math.PI / 4]);
    expect(result[0]).toBeCloseTo(Math.sqrt(2));
    expect(result[1]).toBeCloseTo(Math.sqrt(2));
  });
});
