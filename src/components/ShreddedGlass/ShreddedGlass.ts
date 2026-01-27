import type App from '@src/App/App';
import type { InteractiveElement } from '@src/App/InteractionHadler';
// import getExplosionMap from '@src/utils/getExplosionMap/getExplosionMap';
import autoBind from 'auto-bind';
import * as THREE from 'three';

class ShreddedGlass extends THREE.Mesh implements InteractiveElement {
  constructor(private app: App) {
    super();
    autoBind(this);

    this.geometry = new THREE.BoxGeometry(2, 2, 0.2, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 1.0 });
    this.app.interactionHandler.addElement(this);
  }

  onClick(point: THREE.Vector3) {
    const relativePoint = this.worldToLocal(point.clone());

    console.log(relativePoint);
  }

  public destroy() {
    this.app.interactionHandler.removeElement(this);
  }
}

export default ShreddedGlass;