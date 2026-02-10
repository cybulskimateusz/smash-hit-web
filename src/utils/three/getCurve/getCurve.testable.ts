import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import RenderSystem from '@src/systems/RenderSystem';
import TestableScene from '@testable/TestableScene';
import autoBind from 'auto-bind';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getCurve from './getCurve';

export default class extends TestableScene {
  static path = '/utils/three/getCurve';

  private curveProperties = {
    startPoint: new THREE.Vector3(),
    startTangent: new THREE.Vector3(0, 0, -1).normalize(),
    turnStrength: 0.5,
    turnDirection: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize(),
    length: 10
  };
  private controlPoints: Entity[] = [];
  private curves: THREE.CubicBezierCurve3[] = [];

  init() {
    this.world.addSystem(new RenderSystem(this));

    this.setupGUI();

    this.world.camera.position.set(0, 0, 10);
    new OrbitControls(this.world.camera, this.canvas);
    autoBind(this);
  }

  private setupGUI() {
    const gui = new GUI();
  
    const settings = gui.addFolder('Curve properties');
    settings.add(this.curveProperties, 'turnStrength', 0, 10, 0.1);
    settings.add(this.curveProperties, 'length', 0, 10, 0.1);
    settings.open();

    const direction = gui.addFolder('Turn direction');
    direction.add(this.curveProperties.turnDirection, 'x', 0, Math.PI * 2, 0.001);
    direction.add(this.curveProperties.turnDirection, 'y', 0, Math.PI * 2, 0.001);
    direction.add(this.curveProperties.turnDirection, 'z', 0, Math.PI * 2, 0.001);

    const tangent = gui.addFolder('Start tangent');
    tangent.add(this.curveProperties.startTangent, 'x', 0, 100, 1);
    tangent.add(this.curveProperties.startTangent, 'y', 0, 100, 1);
    tangent.add(this.curveProperties.startTangent, 'z', 0, 100, 1);

    const position = gui.addFolder('Start position');
    position.add(this.curveProperties.startPoint, 'x', 0, 100, 1);
    position.add(this.curveProperties.startPoint, 'y', 0, 100, 1);
    position.add(this.curveProperties.startPoint, 'z', 0, 100, 1);

    gui.add({ create: this.createCurve }, 'create').name('Create using params');
    gui.add({ continue: this.continuePath }, 'continue').name('Continue path');
  }

  private createCurve() {
    const curve = getCurve(this.curveProperties);
    const controlPointMaterial = new THREE.MeshNormalMaterial();
    const controlPointGeometry = new THREE.SphereGeometry(0.5);

    const pointsOnCurve = curve.getPoints(4).map((point) => {
      const threeMesh = new ThreeMesh();
      threeMesh.mesh = new THREE.Mesh(controlPointGeometry, controlPointMaterial);

      const transform = new Transform();
      transform.position.copy(point);

      return this.world.createEntity().add(threeMesh).add(transform);
    });

    this.controlPoints.push(...pointsOnCurve);
    this.curves.push(curve);
    return curve;
  }

  private continuePath() {
    if (!this.curves.length) return this.createCurve();
    
    const previousCurve = this.curves[this.curves.length - 1];

    this.curveProperties.startPoint = previousCurve.getPointAt(1);
    this.curveProperties.startTangent = previousCurve.getTangentAt(1).normalize();
    this.curveProperties.turnDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();

    this.createCurve();
  }
}
