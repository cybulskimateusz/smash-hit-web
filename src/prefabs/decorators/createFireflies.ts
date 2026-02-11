import FireflyMaterial from '@src/materials/FireflyMaterial/FireflyMaterial';
import * as THREE from 'three';

interface FirefliesOptions {
    curve: THREE.CubicBezierCurve3;
    radius: number;
    amount?: number;
}

const FIREFLIES_DEFAULT_OPTIONS = {
  amount: 50
};

const createFireflies = (options: FirefliesOptions): THREE.Points => {
  const firefliesProperties = { ...FIREFLIES_DEFAULT_OPTIONS, ...options };

  const positions: number[] = [];
  const offsets: number[] = [];

  for (let i = 0; i < firefliesProperties.amount; i++) {
    const point = firefliesProperties.curve.getPointAt(Math.random());

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * firefliesProperties.radius * 0.7;
    point.x += Math.cos(angle) * r;
    point.y += Math.sin(angle) * r;

    positions.push(point.x, point.y, point.z);
    offsets.push(Math.random());
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(offsets, 1));

  const material = new FireflyMaterial();
  return new THREE.Points(geometry, material);
};

export default createFireflies;