import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class extends System {
  constructor(private camera: THREE.Camera) {
    super();
    autoBind(this);
  }
  init(): void {}

  update(time: number): void {
    this.camera.position.z = -time;
  }

  onEntityRemoved(_entity: Entity): void {}
}