import type App from '@src/App/App';
import { Expose, Testable } from '@testable/index';
import * as THREE from 'three';

import getExplosionMap from './getExplosionMap';

@Testable({ path: '/utils/getExplosionMap', useOrbitControls: true })
export default class extends THREE.Object3D {
  @Expose({ min: 3, max: 200, step: 1, folder: 'Settings' })
    pointsAmount = 128;

  @Expose({ min: 0.5, max: 10, step: 0.1, folder: 'Settings' })
    planeWidth = 1;

  @Expose({ min: 0.5, max: 10, step: 0.1, folder: 'Settings' })
    planeHeight = 1;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    outerRadius = 0.07;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    innerRadius = 0;

  @Expose({ min: -5, max: 5, step: 0.0001, folder: 'Settings' })
    centerPointX = 0;

  @Expose({ min: -5, max: 5, step: 0.0001, folder: 'Settings' })
    centerPointY = 0;

  @Expose({ folder: 'Settings' })
    regenerate = () => this.generate();

  private cellsLine: THREE.LineSegments;
  private cellsGeometry: THREE.BufferGeometry;

  constructor(_app: App) {
    super();

    this.cellsGeometry = new THREE.BufferGeometry();
    const cellsMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.cellsLine = new THREE.LineSegments(this.cellsGeometry, cellsMaterial);
    this.add(this.cellsLine);

    this.generate();
  }

  private generate() {
    const explosionMap = getExplosionMap({
      amount: this.pointsAmount,
      outerRadius: this.outerRadius,
      innerRadius: this.innerRadius,
      planeSize: { width:this.planeWidth, height: this.planeHeight },
      center: [this.centerPointX, this.centerPointY]
    });

    this.cellsGeometry.setAttribute(
      'position',
      explosionMap
    );
  } 
}
