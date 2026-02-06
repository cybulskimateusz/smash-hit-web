import * as THREE from 'three';

import type World from '../World';

abstract class GameScene extends THREE.Scene {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  constructor(protected world: World, protected canvas: HTMLCanvasElement) {
    super();
    this.addEventListeners();
    queueMicrotask(() => this.init());
  }

  abstract init(): void;

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }
  
  private onResize = (): void => {
    const { width, height } = this.canvas.getBoundingClientRect();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };
}

export default GameScene;