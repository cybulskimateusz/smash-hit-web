import type World from '@src/World';
import { Testable } from '@testable/index';
import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getExplosionMap from './getExplosionMap';

@Testable('/utils/three/getExplosionMap')
export default class extends TestableScene {
  private lines!: THREE.LineSegments;
  private geometry = new THREE.BufferGeometry();
  private params = {
    amount: 128,
    outerRadius: 0.5,
    innerRadius: 0,
    planeWidth: 5,
    planeHeight: 5,
    centerX: 0,
    centerY: 0,
  };

  constructor(world: World, canvas: HTMLCanvasElement) {
    super(world, canvas);

    new OrbitControls(this.camera, canvas);

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.lines = new THREE.LineSegments(this.geometry, material);
    this.add(this.lines);

    this.setupGUI();
    this.generate();

    this.camera.position.set(0, 0, 10);
  }

  private setupGUI() {
    const gui = new GUI();
    const settings = gui.addFolder('Settings');
    settings.add(this.params, 'amount', 3, 200, 1).onChange(() => this.generate());
    settings.add(this.params, 'outerRadius', 0, 10, 0.1).onChange(() => this.generate());
    settings.add(this.params, 'innerRadius', 0, 10, 0.1).onChange(() => this.generate());
    settings.open();

    const plane = gui.addFolder('Plane');
    plane.add(this.params, 'planeWidth', 0.5, 10, 0.1).onChange(() => this.generate());
    plane.add(this.params, 'planeHeight', 0.5, 10, 0.1).onChange(() => this.generate());
    plane.open();

    const center = gui.addFolder('Center');
    center.add(this.params, 'centerX', -5, 5, 0.01).onChange(() => this.generate());
    center.add(this.params, 'centerY', -5, 5, 0.01).onChange(() => this.generate());
    center.open();

    gui.add({ regenerate: () => this.generate() }, 'regenerate');
  }

  private generate() {
    this.geometry.setAttribute('position', getExplosionMap({
      amount: this.params.amount,
      outerRadius: this.params.outerRadius,
      innerRadius: this.params.innerRadius,
      planeSize: { width: this.params.planeWidth, height: this.params.planeHeight },
      center: [this.params.centerX, this.params.centerY]
    }));
  }
}
