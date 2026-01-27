import RAPIER from '@dimforge/rapier3d';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import InteractionHandler from './InteractionHadler';

export const CAMERA_INITIAL_PROPERTIES = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: new THREE.Vector3(0, 0, 5),
};

class App {
  private _scene = new THREE.Scene();
  public get scene() { return this._scene; }
  private _camera: THREE.PerspectiveCamera;
  public get camera() { return this._camera; }
  private _renderer: THREE.WebGLRenderer;
  public get renderer() { return this._renderer; }
  private _world = new RAPIER.World({ x:0, y:-9.81, z:0 });
  public get world() { return this._world; }
  private _interactionHandler: InteractionHandler;
  public get interactionHandler() { return this._interactionHandler; }

  private animationFrame?: ReturnType<typeof requestAnimationFrame>;

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this);

    this._camera = new THREE.PerspectiveCamera(
      CAMERA_INITIAL_PROPERTIES.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_INITIAL_PROPERTIES.near,
      CAMERA_INITIAL_PROPERTIES.far
    );
    this._camera.position.copy(CAMERA_INITIAL_PROPERTIES.position);

    this._renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    this.animate();
    this.addEventListeners();
    this._interactionHandler = new InteractionHandler(this);
  }

  protected onResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  protected animate() {
    this.animationFrame = requestAnimationFrame(this.animate);
    this._renderer.render(this._scene, this._camera);
  }

  public destroy() {
    this.removeEventListeners();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this._renderer.dispose();
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}

export default App;