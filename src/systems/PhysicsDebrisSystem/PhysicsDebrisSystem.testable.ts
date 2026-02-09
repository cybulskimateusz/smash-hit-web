import Debrie from '@src/components/Debrie';
import MeshSplitter from '@src/components/MeshSplitter';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import MeshSplitterSystem from '../MeshSplitterSystem/MeshSplitterSystem';
import PhysicsSystem from '../PhysicsSystem';
import RenderSystem from '../RenderSystem';
import PhysicsDebrisSystem from './PhysicsDebrisSystem';

export default class extends TestableScene {
  static path = '/systems/PhysicsDebrisSystem';
  
  private currentEntity?: Entity;
  private params = {
    amount: 10,
    gravityScale: 1,
  };

  private isSplitted = false;

  init() {
    this.world.addSystem(new PhysicsSystem());
    this.world.addSystem(new MeshSplitterSystem());
    this.world.addSystem(new PhysicsDebrisSystem());
    this.world.addSystem(new RenderSystem(this));

    this.createTestedEntity();
    this.spawnFloor();
    this.createGUI();

    new OrbitControls(this.world.camera, this.canvas);
    this.world.camera.position.set(0, 0, 15);
    this.world.camera.lookAt(0, 0, 0);
  }

  private createTestedEntity() {
    if (this.currentEntity) {
      const mesh = this.currentEntity.get(ThreeMesh)?.mesh;
      if (mesh) mesh.removeFromParent();
      this.world.destroyEntity(this.currentEntity);
    }

    const entity = this.world.createEntity();
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.MeshNormalMaterial()
    );
    mesh.position.set(0, 3, 0);

    const threeMesh = new ThreeMesh();
    threeMesh.mesh = mesh;
    this.add(mesh);

    const transform = new Transform();
    transform.position.copy(mesh.position);

    const meshSplitter = new MeshSplitter();
    meshSplitter.amount = this.params.amount;
    meshSplitter.center.set(0, 3, 0);

    entity
      .add(threeMesh)
      .add(transform)
      .add(meshSplitter);

    this.currentEntity = entity;
  }

  private splitEntity() {
    const meshSplitter = this.currentEntity?.get(MeshSplitter);
    if (!meshSplitter || this.isSplitted) return;

    meshSplitter.shouldSplit = true;

    if (meshSplitter.isSplitted) {
      meshSplitter.debris.forEach(entity => {
        entity.add(new Debrie());
      });
      this.isSplitted = true;
    }
  }

  private createGUI() {
    const gui = new GUI();

    gui.add(this.params, 'amount', 2, 30, 1).name('Split Amount');
    gui.add(this.params, 'gravityScale', 0, 3, 0.1).name('Gravity Scale');
    gui.add({ split: () => this.splitEntity() }, 'split').name('Split & Apply Physics');
    gui.add({ reset: () => this.createTestedEntity() }, 'reset').name('Reset Entity');
  }
}
