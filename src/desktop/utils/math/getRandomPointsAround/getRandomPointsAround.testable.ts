import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getRandomPointsAround from './getRandomPointsAround';

export default class extends TestableScene {
  static path = '/utils/math/getRandomPointsAround';

  private pointsMesh!: THREE.Points;
  private geometry = new THREE.BufferGeometry();
  private params = {
    amount: 100,
    outerRadius: 2,
    innerRadius: 0.5,
  };

  init() {
    new OrbitControls(this.world.camera, this.canvas);

    const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05 });
    this.pointsMesh = new THREE.Points(this.geometry, material);
    this.add(this.pointsMesh);

    this.setupGUI();
    this.generate();

    this.world.camera.position.set(0, 0, 5);
  }

  private setupGUI() {
    const gui = new GUI();
    const settings = gui.addFolder('Settings');
    settings.add(this.params, 'amount', 1, 1000, 1).onChange(() => this.generate());
    settings.add(this.params, 'outerRadius', 0.1, 5, 0.1).onChange(() => this.generate());
    settings.add(this.params, 'innerRadius', 0, 4, 0.1).onChange(() => this.generate());
    settings.open();
    gui.add({ regenerate: () => this.generate() }, 'regenerate');
  }

  private generate() {
    const points = getRandomPointsAround({
      amount: this.params.amount,
      outerRadius: this.params.outerRadius,
      innerRadius: this.params.innerRadius,
    });

    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i][0];
      positions[i * 3 + 1] = points[i][1];
      positions[i * 3 + 2] = 0;
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }
}
