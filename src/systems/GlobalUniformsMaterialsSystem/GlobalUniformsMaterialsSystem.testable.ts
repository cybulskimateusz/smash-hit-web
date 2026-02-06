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
    this.spawnBackEntity();
    const entity = this.world.createEntity();

    const material = new THREE.ShaderMaterial({
      uniforms: GlobalUniformsManager.instance.uniforms,
      vertexShader,
      fragmentShader,
    });

    const threeMesh = new ThreeMesh();
    threeMesh.usesGlobalUniforms = true;
    threeMesh.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);

    entity.add(threeMesh).add(new Transform());

    new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(0, 0, 5);
  }

  private spawnBackEntity() {
    const entity = this.world.createEntity();
    
    const threeMesh = new ThreeMesh();
    threeMesh.mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2), new THREE.MeshNormalMaterial());

    const transform = new Transform();
    transform.position.z = -5;

    entity.add(threeMesh).add(transform);
  }
}