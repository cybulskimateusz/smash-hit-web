import type RAPIER from '@dimforge/rapier3d';
import type * as THREE from 'three';

export interface CollisionEvent {
  handles: number[];
  position: THREE.Vector3;
}

class Collider {
  handle!: number;
  desc!: RAPIER.ColliderDesc;
  isSensor = false;
  collisions: CollisionEvent[] = [];
  onCollision?: (event: CollisionEvent) => void;
}

export default Collider;