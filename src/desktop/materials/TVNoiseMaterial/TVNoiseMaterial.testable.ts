import ThreeMesh from '@desktop/components/ThreeMesh';
import Transform from '@desktop/components/Transform';
import GlobalUniformsMaterialsSystem from
  '@desktop/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import RenderSystem from '@desktop/systems/RenderSystem';
import TestableScene from '@testable/TestableScene';
import * as THREE from 'three';

import TVNoiseMaterial from './TVNoiseMaterial';

export default class extends TestableScene {
  static path = '/materials/TVNoiseMaterial';
  
  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new GlobalUniformsMaterialsSystem());

    const entity = this.world.createEntity();
    const threeMesh = new ThreeMesh();

    threeMesh!.mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 128, 128), new TVNoiseMaterial());
    threeMesh.usesGlobalUniforms = true;

    entity.add(threeMesh).add(new Transform());

    this.world.camera.position.z = 100;
  }
}