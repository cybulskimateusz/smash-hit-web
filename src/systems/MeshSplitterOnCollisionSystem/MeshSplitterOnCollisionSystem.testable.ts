import MeshSplitter from '@src/components/MeshSplitter';
import Transform from '@src/components/Transform';
import type Entity from '@src/Entity';
import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import MeshSplitterSystem from '../MeshSplitterSystem/MeshSplitterSystem';
import PhysicsSystem from '../PhysicsSystem';
import RenderSystem from '../RenderSystem';
import MeshSplitterOnCollisionSystem from './MeshSplitterOnCollisionSystem';

export default class extends TestableScene {
  static path = '/systems/MeshSplitterOnCollisionSystem';
  
  private physicsSystem!: PhysicsSystem;
  private currentEntity?: Entity;
  private params = {
    amount: 10,
    ballSpeed: 50,
  };
  private pieces: Entity[] = [];
  private animationFrame?: ReturnType<typeof requestAnimationFrame>;

  init(): void {
    this.physicsSystem = new PhysicsSystem();
    this.world.addSystem(this.physicsSystem);
    this.world.addSystem(new MeshSplitterSystem());
    this.world.addSystem(new RenderSystem(this));
    this.world.addSystem(new MeshSplitterOnCollisionSystem());

    this.createTestedEntity();
    this.createGUI();

    new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(0, 0, 10);

    window.addEventListener('click', this.shootBall);
    this.update();
  }

  private update() {
    this.animationFrame = requestAnimationFrame(this.update);
    const meshSplitter = this.currentEntity?.get(MeshSplitter);
    if (!meshSplitter || !meshSplitter.debris.length || !meshSplitter.isSplitted) return;
    const center = meshSplitter.center.clone();
    const explosionStrength = 0.1;
    const pieces = meshSplitter.debris;
    const distances = pieces.map(p => p.get(Transform)!.position.distanceTo(center));
    const maxDist = Math.max(...distances, 0.01);

    this.pieces = pieces.map(pieceEntity => {
      const transform = pieceEntity.get(Transform)!;
      const dist = transform.position.distanceTo(center);
      const t = (dist / maxDist);
      const dir = transform.position.clone().sub(center).normalize();
      transform.position.add(dir.multiplyScalar(t * explosionStrength));

      return pieceEntity;
    });
  }

  private createTestedEntity() {
    if (this.currentEntity && this.world.entities.indexOf(this.currentEntity) != -1) 
      this.world.destroyEntity(this.currentEntity);

    this.pieces.forEach(piece => this.world.destroyEntity(piece));
    this.pieces = [];

    this.currentEntity = this.spawnTotemEntity();
    this.currentEntity!.get(MeshSplitter)!.amount = this.params.amount;
  }

  private shootBall(event: MouseEvent) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const ballEntity = this.spawnBall();

    requestAnimationFrame(() => {
      const direction = raycaster.ray.direction.clone().multiplyScalar(this.params.ballSpeed);
      this.physicsSystem.setVelocity(ballEntity, direction);
    });
  }

  private createGUI() {
    const gui = new GUI();

    gui.add(this.params, 'amount', 2, 30, 1).name('Split Amount');
    gui.add(this.params, 'ballSpeed', 10, 100, 1).name('Ball Speed');
    gui.add({ reset: () => this.createTestedEntity() }, 'reset').name('Reset Entity');
  }
}
