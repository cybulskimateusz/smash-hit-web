import MeshSplitter from '@src/components/MeshSplitter';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import TestableScene, { type GeometryType } from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import RenderSystem from '../RenderSystem';
import MeshSplitterSystem from './MeshSplitterSystem';

export default class extends TestableScene {
  static path = '/systems/MeshSplitterSystem';

  private currentEntity?: Entity;
  private pieces: Entity[] = [];
  private params = {
    geometry: 'Sphere' as GeometryType,
    amount: 10,
    outerRadius: 1,
    innerRadius: 0,
    centerX: 0,
    centerY: 0,
    explosionStrength: 0.0001,
  };

  init() {
    this.world.addSystem(new RenderSystem(this));
    this.world.addSystem(new MeshSplitterSystem());
    this.createTestedEntity();
    this.createGUI();

    new OrbitControls(this.world.camera, this.canvas);
    this.world.camera.position.set(0, 0, 10);
    this.animationLoop();
  }

  private animationLoop() {
    requestAnimationFrame(() => this.animationLoop());
    this.world.update();
    this.update();
  }

  private update() {
    const meshSplitter = this.currentEntity?.get(MeshSplitter);
    if (!meshSplitter || !meshSplitter.debris.length) return;
     
    const center = meshSplitter.center.clone();
    const { explosionStrength } = this.params;
    this.pieces = meshSplitter.debris;
    const distances = this.pieces.map(p => p.get(Transform)!.position.distanceTo(center));
    const maxDist = Math.max(...distances, 0.01);

    this.pieces.forEach(pieceEntity => {
      const transform = pieceEntity.get(Transform)!;
      const dist = transform.position.distanceTo(center);
      const t = (dist / maxDist);
      const dir = transform.position.clone().sub(center).normalize();
      transform.position.add(dir.multiplyScalar(t * explosionStrength));
    });
  }

  private createTestedEntity() {
    const currentEntity = this.currentEntity;
    let mesh = currentEntity?.get(ThreeMesh)?.mesh;
    if (mesh) mesh.removeFromParent();
    if (currentEntity) this.world.destroyEntity(currentEntity);
    if (this.pieces.length) this.pieces.forEach(piece => {
      piece.get(ThreeMesh)?.mesh.removeFromParent();
      this.world.destroyEntity(piece);
    });

    const transform = new Transform();

    const entity = this.world.createEntity();
    const geometry = this.getGeometry(this.params.geometry);
    mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    const threeMesh = new ThreeMesh();
    threeMesh.mesh = mesh;
    this.add(threeMesh.mesh);
    entity.add(threeMesh);
    entity.add(transform);

    const meshSplitter = new MeshSplitter();
    meshSplitter.amount = this.params.amount;
    meshSplitter.outerRadius = this.params.outerRadius;
    meshSplitter.innerRadius = this.params.innerRadius;
    meshSplitter.center.set(this.params.centerX, this.params.centerY, transform.position.z);

    entity.add(meshSplitter);

    this.currentEntity = entity;
  }

  private splitEntity(entity: Entity) {
    const meshSplitter = entity.get(MeshSplitter);
    if (!meshSplitter) return;

    meshSplitter.shouldSplit = true;
  };

  private createGUI() {
    const gui = new GUI();

    gui.add(this.params, 'geometry', ['Sphere', 'Box', 'Cylinder', 'Cone', 'Icosahedron'])
      .name('Geometry').onChange(() => this.createTestedEntity());

    const splitter = gui.addFolder('MeshSplitter');
    splitter.add(this.params, 'amount', 2, 30, 1).name('Amount');
    splitter.add(this.params, 'outerRadius', 0.1, 5, 0.1).name('Outer Radius');
    splitter.add(this.params, 'innerRadius', 0, 2, 0.1).name('Inner Radius');
    splitter.add(this.params, 'centerX', -3, 3, 0.1).name('Center X');
    splitter.add(this.params, 'centerY', -3, 3, 0.1).name('Center Y');
    splitter.add(this.params, 'explosionStrength', 0, 2, 0.01).name('Explosion');
    splitter.open();

    gui.add({ split: () => this.splitEntity(this.currentEntity!) }, 'split').name('Split Entity');
  }
}