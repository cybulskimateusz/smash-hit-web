import type App from '@src/App/App';
import { Expose, Testable } from '@testable/index';
import * as THREE from 'three';

import getRandomPointsAround from './getRandomPointsAround';

@Testable({ path: '/utils/math/getRandomPointsAround', useOrbitControls: true })
export default class extends THREE.Object3D {
  @Expose({ min: 1, max: 1000, step: 1, folder: 'Settings' })
    amount = 100;

  @Expose({ min: 0.1, max: 5, step: 0.1, folder: 'Settings' })
    outerRadius = 2;

  @Expose({ min: 0, max: 4, step: 0.1, folder: 'Settings' })
    innerRadius = 0.5;

  @Expose({ folder: 'Settings' })
    regenerate = () => this.generatePoints();

  private pointsMesh: THREE.Points;
  private geometry: THREE.BufferGeometry;

  constructor(_app: App) {
    super();

    this.geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      sizeAttenuation: true,
    });

    this.pointsMesh = new THREE.Points(this.geometry, material);
    this.add(this.pointsMesh);

    this.generatePoints();
  }

  private generatePoints() {
    const points = getRandomPointsAround({
      amount: this.amount,
      outerRadius: this.outerRadius,
      innerRadius: this.innerRadius,
    });
    const positions = new Float32Array(points.length * 3);

    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i][0]; // position X
      positions[i * 3 + 1] = points[i][1]; // position y
      positions[i * 3 + 2] = 0; // position z
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }
}
