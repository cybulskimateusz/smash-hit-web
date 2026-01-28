import autoBind from 'auto-bind';
import * as THREE from 'three';

import type App from './App';

export interface InteractiveElement extends THREE.Object3D {
    onClick: (mouse: THREE.Vector3) => void;
}

class InteractionHandler {
  private raycaster = new THREE.Raycaster();
  private raycastedElements: InteractiveElement[] = [];
  private mouse = new THREE.Vector2();

  constructor(private app: App) {
    autoBind(this);
    this.addEventListeners();
  }

  public addElement(node: InteractiveElement) {
    this.raycastedElements.push(node);
  }

  public removeElement(node: InteractiveElement) {
    this.raycastedElements = this.raycastedElements.filter(item => item !== node);
  }

  protected onClick(event: MouseEvent) {
    this.mouse.x = (event.clientX / innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.app.camera);
    this.raycaster.layers.enableAll();
    const intersected = this.raycaster.intersectObjects(this.raycastedElements);

    for (const intersection of intersected) {
      (intersection.object as InteractiveElement).onClick(intersection.point);
    }
  }

  public addEventListeners() {
    window.addEventListener('click', this.onClick);
  }

  public removeEventListeners() {
    window.removeEventListener('click', this.onClick);
  }

  public destroy() {
    this.removeEventListeners();
  }
}

export default InteractionHandler;