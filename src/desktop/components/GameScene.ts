import * as THREE from 'three';

import type World from '../core/World';

abstract class GameScene extends THREE.Scene {
  constructor(protected _world: World, protected canvas: HTMLCanvasElement) {
    super();
    this.addEventListeners();
    queueMicrotask(() => this.init());
  }

  public get world() { return this._world; }

  abstract init(): void;
  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }
  
  private onResize = (): void => {
    const { width, height } = this.canvas.getBoundingClientRect();

    this.world.camera.aspect = width / height;
    this.world.camera.updateProjectionMatrix();
  };
}

export default GameScene;