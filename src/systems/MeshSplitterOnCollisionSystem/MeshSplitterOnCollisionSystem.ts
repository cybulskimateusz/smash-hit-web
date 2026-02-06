import Collider from '../../components/Collider';
import MeshSplitter from '../../components/MeshSplitter';
import Entity from '../../Entity';
import System from '../../System';

/**
 * Toggles mesh splitting on collided MeshSplitter.
 */
export default class MeshSplitterOnCollisionSystem extends System {
  update(): void {
    this.query(Collider, MeshSplitter).forEach(this.splitOnCollision);
  }

  private splitOnCollision(entity: Entity) {
    const collider = entity.get(Collider);
    if (!collider || collider.collisions.length === 0) return;

    const meshSplitter = entity.get(MeshSplitter);
    if (!meshSplitter || meshSplitter.isSplitted) return;

    meshSplitter.center = collider.collisions[0].position.clone();
    meshSplitter.isSplitted = true;
  }

  onEntityRemoved(_entity:Entity): void {}
}