import type App from '@src/App/App';
import type { InteractiveElement } from '@src/App/InteractionHadler';
import ShreddableModifier from '@src/modifiers/ShreddableModifier/ShreddableModifier';
import autoBind from 'auto-bind';
import * as THREE from 'three';

class ShreddedGlassMesh extends THREE.Mesh implements InteractiveElement {
  constructor(private clickHandler: (point: THREE.Vector3) => void) {
    super();

    this.geometry = new THREE.BoxGeometry(5, 10, 0.2);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    autoBind(this);
  }

  onClick(mouse: THREE.Vector3) {
    this.clickHandler(mouse);
  }
}

class ShreddedGlass extends THREE.Object3D {
  protected mesh: ShreddableModifier;

  constructor(private app: App) {
    super();
    autoBind(this);

    const interactiveMesh = new ShreddedGlassMesh(this.onClick);
    this.app.interactionHandler.addElement(interactiveMesh);

    this.mesh = new ShreddableModifier(app, interactiveMesh);
    this.add(this.mesh);
  }

  public onClick(point: THREE.Vector3) {
    const relativePoint = this.worldToLocal(point.clone());

    this.mesh.destroyAt(relativePoint);
  }

  public destroy() {
    this.app.interactionHandler.removeElement(this);
  }

  public reset() {
    this.mesh.reset();
  }
}

export default ShreddedGlass;