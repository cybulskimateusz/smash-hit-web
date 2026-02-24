import RAPIER from '@dimforge/rapier3d';
import * as THREE from 'three';

import Collider from '../components/Collider';
import RigidBody from '../components/RigidBody';
import Transform from '../components/Transform';
import type Entity from '../core/Entity';
import System from '../core/System';

class PhysicsSystem extends System {
  private rapierWorld!: RAPIER.World;
  private eventQueue!: RAPIER.EventQueue;
  private removedHandles = new Set<number>();

  async init() {
    const gravity = { x: 0, y: -9.81, z: 0 };
    this.rapierWorld = new RAPIER.World(gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  update() {
    if (!this.rapierWorld) return;

    const gravity = this.world.camera.up.clone().negate().multiplyScalar(9.81);
    this.rapierWorld.gravity = { x: gravity.x, y: gravity.y, z: gravity.z };

    this.createPendingBodies();
    this.rapierWorld.step(this.eventQueue);
    this.handleCollisionEvents();
    this.syncPhysicsToTransform();
  }

  private handleCollisionEvents() {
    const entities = this.query(Collider);

    // Clear collisions from previous frame
    entities.forEach(entity => {
      const collider = entity.get(Collider);
      if (collider) collider.collisions = [];
    });

    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) return;

      // Skip events involving removed handles
      if (this.removedHandles.has(handle1) || this.removedHandles.has(handle2)) return;

      const collider1 = this.rapierWorld.getCollider(handle1);
      const collider2 = this.rapierWorld.getCollider(handle2);
      if (!collider1 || !collider2) return;

      const contactPoint = this.getContactPoint(collider1, collider2);
      const event = { handles: [handle1, handle2], position: contactPoint };

      entities.forEach(entity => {
        const collider = entity.get(Collider);
        if (!collider) return;

        if (collider.handle === handle1 || collider.handle === handle2) {
          collider.collisions.push(event);
          collider.onCollision?.(event);
        }
      });
    });

    // Clear removed handles after processing
    this.removedHandles.clear();
  }

  private getContactPoint(
    collider1: RAPIER.Collider,
    collider2: RAPIER.Collider
  ): THREE.Vector3 {
    const collider1Position = collider1.translation();
    const collider2Position = collider2.translation();
    return new THREE.Vector3(
      (collider1Position.x + collider2Position.x) / 2,
      (collider1Position.y + collider2Position.y) / 2,
      (collider1Position.z + collider2Position.z) / 2
    );
  }

  private createPendingBodies() {
    const entities = this.query(RigidBody, Transform);
    entities.forEach(entity => {
      const rigidBody = entity.get(RigidBody);
      if (rigidBody && rigidBody.handle === undefined) {
        this.createPhysicsBody(entity);
      }
    });
  }

  createPhysicsBody(entity: Entity) {
    const rigidBody = entity.get(RigidBody);
    const transform = entity.get(Transform);

    if (!rigidBody || !transform) return;

    const rigidBodyDesc = rigidBody.desc;

    rigidBodyDesc.setTranslation(
      transform.position.x,
      transform.position.y,
      transform.position.z
    );

    const quaternion = new THREE.Quaternion().setFromEuler(transform.rotation);
    rigidBodyDesc.setRotation(quaternion);

    rigidBodyDesc.setGravityScale(rigidBody.gravityScale);

    const body = this.rapierWorld.createRigidBody(rigidBodyDesc);
    rigidBody.handle = body.handle;

    const collider = entity.get(Collider);
    if (!collider?.desc) return;

    if (collider.isSensor) {
      collider.desc.setSensor(true);
    }

    const rapierCollider = this.rapierWorld.createCollider(
      collider.desc,
      body
    );
    collider.handle = rapierCollider.handle;
  }

  private syncPhysicsToTransform() {
    const entities = this.query(RigidBody, Transform);

    entities.forEach(entity => {
      const rigidBody = entity.get(RigidBody);
      const transform = entity.get(Transform);
      if (!rigidBody || !transform) return;
      if (rigidBody.handle === undefined) return;

      const body = this.rapierWorld.getRigidBody(rigidBody.handle);
      if (!body) return;

      if (body.gravityScale() !== rigidBody.gravityScale) {
        body.setGravityScale(rigidBody.gravityScale, true);
      }

      const translation = body.translation();
      transform.position.set(translation.x, translation.y, translation.z);

      const rotation = body.rotation();
      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
      );
      transform.rotation.copy(euler);
    });
  }

  applyImpulse(entity: Entity, impulse: THREE.Vector3) {
    const rigidBody = entity.get(RigidBody);
    if (!rigidBody) return;

    const body = this.rapierWorld.getRigidBody(rigidBody.handle);
    if (!body) return;

    body.applyImpulse(
      { x: impulse.x, y: impulse.y, z: impulse.z },
      true
    );
  }

  setVelocity(entity: Entity, velocity: THREE.Vector3) {
    const rigidBody = entity.get(RigidBody);
    if (!rigidBody) return;

    const body = this.rapierWorld.getRigidBody(rigidBody.handle);
    if (!body) return;

    body.setLinvel({ x: velocity.x, y: velocity.y, z: velocity.z }, true);
  }

  onEntityRemoved(entity: Entity) {
    const rigidBody = entity.get(RigidBody);
    if (!rigidBody) return;

    const body = this.rapierWorld.getRigidBody(rigidBody.handle);
    if (!body) return;
    
    this.rapierWorld.removeRigidBody(body);
  }
}

export default PhysicsSystem;
