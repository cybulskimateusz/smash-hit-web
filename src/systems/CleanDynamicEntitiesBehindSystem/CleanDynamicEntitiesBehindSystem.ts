import Dynamic from '@src/components/Dynamic';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import autoBind from 'auto-bind';
import * as THREE from 'three';

const CLEANUP_DISTANCE = 200;

export default class extends System {
  init(): void {
    autoBind(this);
  }

  update(): void {
    this.query(Dynamic).forEach(this.removeEntitiesBehind);
  }

  private removeEntitiesBehind(entity: Entity) {
    const transform = entity.get(Transform);
    if (!transform) return;
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(this.world.camera.quaternion);

    const toEntity = transform.position.clone().sub(this.world.camera.position);

    const dotProduct = toEntity.dot(cameraDirection);

    if (dotProduct < -CLEANUP_DISTANCE) {
      this.world.destroyEntity(entity);
    }
  }

  onEntityRemoved(): void {}
}
