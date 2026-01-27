import type App from '@src/App/App';
import { Expose, Testable } from '@testable/index';
import * as THREE from 'three';

import getExplosionMap from './getExplosionMap3D';

@Testable({ path: '/utils/three/getExplosionMap3D', useOrbitControls: true })
export default class extends THREE.Object3D {
  @Expose({ min: 3, max: 200, step: 1, folder: 'Settings' })
    pointsAmount = 128;

  @Expose({ min: 1, max: 10, step: 0.01, folder: 'Box' })
    boxWidth = 5;

  @Expose({ min: 1, max: 10, step: 0.01, folder: 'Box' })
    boxHeight = 5;

  @Expose({ min: 0.5, max: 10, step: 0.01, folder: 'Box' })
    boxDepth = 0.2;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    outerRadius = 0.07;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    innerRadius = 0;

  @Expose({ min: -5, max: 5, step: 0.0001, folder: 'Settings' })
    centerPointX = 0;

  @Expose({ min: -5, max: 5, step: 0.0001, folder: 'Settings' })
    centerPointY = 0;

  @Expose({ folder: 'refresh' })
    regenerate = () => this.generate();

  private pieces: THREE.Mesh[] = [];

  constructor(_app: App) {
    super();

    this.generate();
  }

  private generate() {
    const explosionMap = getExplosionMap({
      amount: this.pointsAmount,
      outerRadius: this.outerRadius,
      innerRadius: this.innerRadius,
      boxSize: new THREE.Vector3(this.boxWidth, this.boxHeight, this.boxDepth),
      center: [this.centerPointX, this.centerPointY]
    });

    this.pieces.forEach(piece => piece.removeFromParent());
    this.pieces = [];

    explosionMap.forEach(geometry => {
      const piece = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
      this.pieces.push(piece);
      this.add(piece);
    });
  } 
}
