import MaterialWithGlobalUniforms from '@src/components/EntityWithGlobalUniforms';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import GlobalUniformsManager from '@src/managers/GlobalUniformsManager';
import TestableScene from '@testable/TestableScene';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import RenderSystem from '../RenderSystem';
import GlobalUniformsMaterialsSystem from './GlobalUniformsMaterialsSystem';
import fragmentShader from './GlobalUniformsMaterialsSystem.frag';
import vertexShader from './GlobalUniformsMaterialsSystem.vert';

export default class extends TestableScene {
  static path = '/systems/GlobalUniformsMaterial';

  init() {
    this.world.addSystem(new RenderSystem(this));
    this.world.addSystem(new GlobalUniformsMaterialsSystem());

    this.spawnFloor();
    const entity = this.world.createEntity();

    const material = new THREE.ShaderMaterial({
      uniforms: GlobalUniformsManager.instance.uniforms,
      vertexShader,
      fragmentShader,
    });

    const threeMesh = new ThreeMesh();
    threeMesh.mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
    threeMesh.mesh.layers.set(1);

    entity.add(threeMesh).add(new MaterialWithGlobalUniforms()).add(new Transform());

    new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(0, 0, 5);
  }
}