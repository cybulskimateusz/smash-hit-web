import type { InteractiveElement } from '@src/App/InteractionHadler';
import ShreddableModifier from '@src/modifiers/ShreddableModifier/ShreddableModifier';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import fragmentShader from './ShreddedGlass.frag';
import vertexShader from './ShreddedGlass.vert';

class ShreddedGlassMesh extends THREE.Mesh implements InteractiveElement {
  constructor(
    private clickHandler: (point: THREE.Vector3) => void,
  ) {
    super();
    this.layers.set(1);

    this.geometry = new THREE.BoxGeometry(5, 10, 0.2);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      uniforms: {
        uSceneTexture: { value: window.app.renderer.getBackgroundTexture(1) },
      }
    });

    autoBind(this);
  }

  onClick(mouse: THREE.Vector3) {
    this.clickHandler(mouse);
  }
}

class ShreddedGlass extends THREE.Object3D {
  protected mesh: ShreddableModifier;
  private interactiveMesh: InteractiveElement & THREE.Mesh;

  constructor() {
    super();
    autoBind(this);

    this.interactiveMesh = new ShreddedGlassMesh(this.onClick);
    window.app.interactionHandler.addElement(this.interactiveMesh);

    this.mesh = new ShreddableModifier(this.interactiveMesh);
    this.add(this.mesh);
    this.animate();
  }

  public onClick(point: THREE.Vector3) {
    this.mesh.destroyAt(point);
  }

  public animate() {
    requestAnimationFrame(this.animate);
    window.app.world.step();
    this.mesh.update();
  }

  public destroy() {
    window.app.interactionHandler.removeElement(this);
  }

  public reset() {
    this.mesh.reset();
  }
}

export default ShreddedGlass;