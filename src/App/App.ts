import RAPIER from '@dimforge/rapier3d';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import InteractionHandler from './InteractionHadler';
import LayeredRenderer from './LayeredRenderer';

export const CAMERA_INITIAL_PROPERTIES = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(0, 0, 5),
};

declare global {
    interface Window {
        app: App;
    }
}

class App {
  private _scene = new THREE.Scene();
  public get scene() { return this._scene; }
  private _camera: THREE.PerspectiveCamera;
  public get camera() { return this._camera; }
  private _renderer: LayeredRenderer;
  public get renderer() { return this._renderer; }
  private _world = new RAPIER.World({ x:0, y:-9.81, z:0 });
  public get world() { return this._world; }
  private _interactionHandler: InteractionHandler;
  public get interactionHandler() { return this._interactionHandler; }

  private animationFrame?: ReturnType<typeof requestAnimationFrame>;

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this);
    window.app = this;

    this._camera = new THREE.PerspectiveCamera(
      CAMERA_INITIAL_PROPERTIES.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_INITIAL_PROPERTIES.near,
      CAMERA_INITIAL_PROPERTIES.far
    );
    this._camera.position.copy(CAMERA_INITIAL_PROPERTIES.position);

    this._renderer = new LayeredRenderer({ canvas, antialias: true }, 2);

    this.addEventListeners();
    this._interactionHandler = new InteractionHandler(this);
  }

  protected onResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  public destroy() {
    this.removeEventListeners();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this._renderer.destroy();
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}

export default App;