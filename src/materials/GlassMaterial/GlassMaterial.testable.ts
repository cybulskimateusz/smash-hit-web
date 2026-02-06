import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/Entity';
import GlobalUniformsMaterialsSystem from '@src/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import RenderSystem from '@src/systems/RenderSystem';
import TestableScene, { type GeometryType } from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import GlassMaterial from './GlassMaterial';

export default class extends TestableScene {
  static path = '/materials/GlassMaterial';

  private material = new GlassMaterial();

  private currentEntity?: Entity;
  private params = {
    geometry: 'Sphere' as GeometryType,
  };

  init() {
    this.world.addSystem(new RenderSystem(this));
    this.world.addSystem(new GlobalUniformsMaterialsSystem());

    this.spawnFloor();
    this.spawnBackEntity();
    this.createTestedEntity();
    this.createGUI();

    new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(0, 0, 5);
  }

  private createTestedEntity() {
    if (this.currentEntity) {
      const mesh = this.currentEntity.get(ThreeMesh)?.mesh;
      if (mesh) mesh.removeFromParent();
      this.world.destroyEntity(this.currentEntity);
    }

    const entity = this.world.createEntity();
    const geometry = this.getGeometry(this.params.geometry);

    const threeMesh = new ThreeMesh();
    threeMesh.usesGlobalUniforms = true;
    threeMesh.mesh = new THREE.Mesh(geometry, this.material);
    threeMesh.mesh.layers.set(1);

    entity.add(threeMesh).add(new Transform());

    this.currentEntity = entity;
  }

  private createGUI() {
    const gui = new GUI();
    gui.add(this.params, 'geometry', ['Sphere', 'Box', 'Cylinder', 'Cone', 'Icosahedron'])
      .name('Geometry').onChange(() => this.createTestedEntity());

    const iorRGB = this.material.uniforms.uIndexesOfRefractionRGB.value;
    const iorCYV = this.material.uniforms.uIndexesOfRefractionCYV.value;
    const refractionFolder = gui.addFolder('Refraction');
    refractionFolder.add(iorRGB, 'x', 0.0, 2.0, 0.00001).name('R');
    refractionFolder.add(iorRGB, 'y', 0.0, 2.0, 0.00001).name('G');
    refractionFolder.add(iorRGB, 'z', 0.0, 2.0, 0.00001).name('B');
    refractionFolder.add(iorCYV, 'x', 0.0, 2.0, 0.00001).name('C');
    refractionFolder.add(iorCYV, 'y', 0.0, 2.0, 0.00001).name('Y');
    refractionFolder.add(iorCYV, 'z', 0.0, 2.0, 0.00001).name('V');
    refractionFolder.open();

    const otherUniforms = this.material.uniforms;
    const otherUniformsFolder = gui.addFolder('Other uniforms');
    otherUniformsFolder.add(otherUniforms.uChromaticAberration, 'value', 0, 2, 0.00001).name('Chromatic Abberation');
    otherUniformsFolder.add(otherUniforms.uRefractionPower, 'value', 0, 2, 0.00001).name('Refraction Power');
    otherUniformsFolder.add(otherUniforms.uSaturation, 'value', 0, 2, 0.00001).name('Saturation');
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