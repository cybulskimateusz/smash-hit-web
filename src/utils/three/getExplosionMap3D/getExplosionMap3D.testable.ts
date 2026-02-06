import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getExplosionMap3D from './getExplosionMap3D';

export default class extends TestableScene {
  static path = '/utils/three/getExplosionMap3D';

  private pieces: THREE.Mesh[] = [];
  private params = {
    pointsAmount: 128,
    outerRadius: 1.4,
    innerRadius: 0,
    boxWidth: 5,
    boxHeight: 5,
    boxDepth: 0.2,
    centerPointX: 0,
    centerPointY: 0,
  };

  init() {
    new OrbitControls(this.camera, this.canvas);
    this.setupGUI();
    this.generate();

    this.camera.position.set(0, 0, 10);
  }

  private setupGUI() {
    const gui = new GUI();

    const settings = gui.addFolder('Settings');
    settings.add(this.params, 'pointsAmount', 3, 200, 1).onChange(() => this.generate());
    settings.add(this.params, 'outerRadius', 0, 10, 0.1).onChange(() => this.generate());
    settings.add(this.params, 'innerRadius', 0, 10, 0.1).onChange(() => this.generate());
    settings.open();

    const box = gui.addFolder('Box');
    box.add(this.params, 'boxWidth', 1, 10, 0.1).onChange(() => this.generate());
    box.add(this.params, 'boxHeight', 1, 10, 0.1).onChange(() => this.generate());
    box.add(this.params, 'boxDepth', 0.1, 5, 0.1).onChange(() => this.generate());
    box.open();

    const center = gui.addFolder('Center');
    center.add(this.params, 'centerPointX', -5, 5, 0.01).onChange(() => this.generate());
    center.add(this.params, 'centerPointY', -5, 5, 0.01).onChange(() => this.generate());
    center.open();

    gui.add({ regenerate: () => this.generate() }, 'regenerate');
  }

  private generate() {
    this.pieces.forEach(piece => piece.removeFromParent());
    this.pieces = [];

    const geometries = getExplosionMap3D({
      amount: this.params.pointsAmount,
      outerRadius: this.params.outerRadius,
      innerRadius: this.params.innerRadius,
      boxSize: new THREE.Vector3(this.params.boxWidth, this.params.boxHeight, this.params.boxDepth),
      center: [this.params.centerPointX, this.params.centerPointY]
    });

    geometries.forEach(geometry => {
      const piece = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({ wireframe: true }));
      this.pieces.push(piece);
      this.add(piece);
    });
  }
}
