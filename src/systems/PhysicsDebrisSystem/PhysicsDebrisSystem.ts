import RAPIER from '@dimforge/rapier3d';
import Debrie from '@src/components/Debrie';

import Collider from '../../components/Collider';
import RigidBody from '../../components/RigidBody';
import ThreeMesh from '../../components/ThreeMesh';
import Entity from '../../core/Entity';
import System from '../../core/System';

export default class PhysicsDebrisSystem extends System {
  update(): void {
    this.query(Debrie).forEach(entity => {
      this.setupDebrisPhysics(entity);
    });
  }

  onEntityRemoved(_entity:Entity): void {}

  private setupDebrisPhysics(entity: Entity) {
    if (entity.has(RigidBody)) return;

    const mesh = entity.get(ThreeMesh)?.mesh;
    if (!mesh) return;

    const rigidBody = new RigidBody();
    rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();

    const geo = mesh.geometry;
    const hull = RAPIER.ColliderDesc.convexHull(
          geo.attributes.position.array as Float32Array
    );
    if (!hull) return;

    const collider = new Collider();
    collider.desc = hull;

    entity.add(rigidBody).add(collider);
  };
}
