import Collider from '@desktop/components/Collider';
import Debrie from '@desktop/components/Debrie';
import RigidBody from '@desktop/components/RigidBody';
import ThreeMesh from '@desktop/components/ThreeMesh';
import Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import type { ConvexHullResponse } from '@desktop/workers/convexHullWorker';
import ConvexHullWorker from '@desktop/workers/convexHullWorker?worker';
import RAPIER from '@dimforge/rapier3d';
import autoBind from 'auto-bind';

export default class PhysicsDebrisSystem extends System {
  private worker = new ConvexHullWorker();
  private pendingEntities = new Map<number, Entity>();
  private nextId = 0;

  init(): void {
    autoBind(this);
    this.worker.onmessage = (e: MessageEvent<ConvexHullResponse>) => {
      const { id, hullVertices } = e.data;
      const entity = this.pendingEntities.get(id);
      this.pendingEntities.delete(id);

      if (!entity || !this.world.entities.includes(entity)) return;

      const hull = RAPIER.ColliderDesc.convexHull(hullVertices);
      if (!hull) return;

      const rigidBody = new RigidBody();
      rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();
      rigidBody.gravityScale = 3;

      const collider = new Collider();
      collider.desc = hull;

      entity.add(rigidBody).add(collider);
    };
  }

  update(): void {
    this.query(Debrie).forEach(entity => 
      this.queueDebrisPhysics(entity)
    );
  }

  onEntityRemoved(_entity: Entity): void {}

  private queueDebrisPhysics(entity: Entity) {
    if (entity.has(RigidBody)) return;
    if ([...this.pendingEntities.values()].includes(entity)) return;

    const mesh = entity.get(ThreeMesh)?.mesh;
    if (!mesh) return;

    const id = this.nextId++;
    this.pendingEntities.set(id, entity);

    const vertices = mesh.geometry.attributes.position.array as Float32Array;
    if (vertices.length < 12) return; // Need at least 4 points (12 floats) for convex hull

    const verticesCopy = new Float32Array(vertices);

    this.worker.postMessage(
      { id, vertices: verticesCopy },
      { transfer: [verticesCopy.buffer] }
    );
  }
}
