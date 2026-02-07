import Dynamic from '@src/components/Dynamic';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import autoBind from 'auto-bind';
import * as THREE from 'three';

/**
 * // TODO Apply Dynamic only on items that require it.
 * Right now newly thrown ball has position Z of camera
 * what removes it immediately after camera moves.
 */
const SAFE_DISTANCE_BOUND = 5;

export default class extends System {
  constructor(private camera: THREE.Camera) {
    super();
    autoBind(this);
  }

  update(): void {
    this.query(Dynamic).forEach(this.removeEntitiesBehind);
  }

  private removeEntitiesBehind(entity: Entity) {
    const transform = entity.get(Transform);
    if (!transform) return;

    if (transform.position.z > this.camera.position.z + SAFE_DISTANCE_BOUND) {
      this.world.destroyEntity(entity);
    }
  }

  init(): void {}
  onEntityRemoved(): void {}
}