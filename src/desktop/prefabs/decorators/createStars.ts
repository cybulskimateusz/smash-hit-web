import * as THREE from 'three';

const createStars = (curve: THREE.Curve<THREE.Vector3>, count: number, radius: number) => {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const offset = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).cross(tangent).normalize().multiplyScalar(radius * (1 + Math.random()));

    positions.push(point.x + offset.x, point.y + offset.y, point.z + offset.z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });
  return new THREE.Points(geometry, material);
};

export default createStars;