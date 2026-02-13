import CameraRail from '@desktop/components/CameraRail';
import ThreeMesh from '@desktop/components/ThreeMesh';
import Transform from '@desktop/components/Transform';
import Entity from '@desktop/core/Entity';
import TestableScene from '@testable/TestableScene';
import autoBind from 'auto-bind';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import RenderSystem from '../RenderSystem';
import CameraRailGenerationSystem from './CameraRailGenerationSystem';

class CameraRailGenerationSystemTestable extends TestableScene {
  private testedSystem = new CameraRailGenerationSystem();
  private visibleHelpers = new Map<Entity, Entity[]>();
  public traveler?: Entity;

  init(): void {
    autoBind(this);

    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(this.testedSystem);

    new OrbitControls(this.world.camera, this.canvas);
    this.world.camera.position.set(0, 0, 10);

    this.traveler = this.createTraveler();

    this.addGUI();
    this.update();
  }

  update() {
    requestAnimationFrame(this.update);
    this.testedSystem.query(CameraRail).forEach(this.showHelpers);
    this.cleanup();
  }

  protected addGUI() {
    new GUI().add({ increment: this.incrementRails }, 'increment').name('Increment rails progress');
  }

  protected createTraveler() {
    const entity = this.world.createEntity();

    const threeMesh = new ThreeMesh();
    const material = new THREE.MeshNormalMaterial();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    threeMesh.mesh = new THREE.Mesh(geometry, material);

    return entity.add(new Transform()).add(threeMesh);
  }

  protected incrementRails() {
    const currentPath = this.testedSystem.query(CameraRail).find(
      entity => entity.get(CameraRail)!.progress < 1
    );
    if (!currentPath) return;

    const currentRail = currentPath.get(CameraRail)!;
    currentRail.progress += 0.1;

    const position = currentRail.rail.getPointAt(currentRail.progress);
    this.traveler?.get(Transform)!.position.copy(position);
  }

  showHelpers(entity: Entity) {
    if (this.visibleHelpers.has(entity)) return;
    
    const curve = entity.get(CameraRail)!.rail;

    const controlPointMaterial = new THREE.MeshNormalMaterial();
    const controlPointGeometry = new THREE.SphereGeometry(10);

    const helpers = curve.getPoints(4).map((point) => {
      const threeMesh = new ThreeMesh();
      threeMesh.mesh = new THREE.Mesh(controlPointGeometry, controlPointMaterial);

      const transform = new Transform();
      transform.position.copy(point);

      return this.world.createEntity().add(threeMesh).add(transform);
    });
    this.visibleHelpers.set(entity, helpers);
  }

  cleanup() {
    this.visibleHelpers.forEach((helpers, rail) => {
      if (this.world.entities.includes(rail)) return;

      helpers.forEach(helper => this.world.destroyEntity(helper));
      this.visibleHelpers.delete(rail);
    });
  }

  static path = '/systems/CameraRailGenerationSystem';
}

export default CameraRailGenerationSystemTestable;