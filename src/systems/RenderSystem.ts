import autoBind from 'auto-bind';
import * as THREE from 'three';

import ThreeObject from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../Entity';
import System from '../System';

class RenderSystem extends System {
  constructor(private scene: THREE.Scene) {
    super();
    autoBind(this);
  }

  update() {
    const entities = this.query(ThreeObject, Transform);

    entities.forEach(entity => {
      this.addPendingMeshToScene(entity);
      this.applyEntityTransform(entity);
    });
  }

  private addPendingMeshToScene(entity: Entity) {
    const threeObject = entity.get(ThreeObject);
    const mesh = threeObject?.mesh;
    if (!mesh || mesh.parent) return;

    this.scene.add(mesh);
  }

  private applyEntityTransform(entity: Entity) {
    const threeObject = entity.get(ThreeObject);
    const transform = entity.get(Transform);
    if (!threeObject?.mesh || !transform) return;

    threeObject.mesh.position.copy(transform.position);
    threeObject.mesh.rotation.copy(transform.rotation);
    threeObject.mesh.scale.copy(transform.scale);
  }

  onEntityRemoved(entity:Entity): void {
    const mesh = entity.get(ThreeObject);
    if (!mesh) return;

    mesh.mesh.removeFromParent();
  }
}

export default RenderSystem;
