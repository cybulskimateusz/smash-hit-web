import MeshSplitter from '@src/components/MeshSplitter';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class extends System {
  constructor(private camera: THREE.Camera) {
    super();
    autoBind(this);
  }

  update(): void {
    this.query(Transform, MeshSplitter).forEach(this.removeEntitiesBehind);
  }

  private removeEntitiesBehind(entity: Entity) {
    const transform = entity.get(Transform);
    if (!transform) return;

    if (transform.position.z > this.camera.position.z) {
      this.world.destroyEntity(entity);
    }
  }

  init(): void {}
  onEntityRemoved(): void {}
}