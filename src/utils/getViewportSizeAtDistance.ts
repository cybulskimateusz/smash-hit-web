export const getViewportSizeAtDistance = (viewport: Size2D, fov: number, distance: number) => {
  const height = 2 * Math.tan(fov / 2) * distance;
  const aspect = viewport.width / viewport.height;
  const width = height * aspect;

  return { width, height };
};