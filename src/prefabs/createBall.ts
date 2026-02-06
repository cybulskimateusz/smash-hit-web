import RAPIER from '@dimforge/rapier3d';
import * as THREE from 'three';

import Collider from '../components/Collider';
import RigidBody from '../components/RigidBody';
import ThreeMesh from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../Entity';
import type World from '../World';

export interface BallOptions {
  position?: THREE.Vector3;
  radius?: number;
  color?: number;
}

export default function createBall(
  world: World,
  options: BallOptions = {}
): Entity {
  const {
    position = new THREE.Vector3(0, 0, 0),
    radius = 0.3,
    color = 0xff6600,
  } = options;

  const entity = world.createEntity();

  // Transform component
  const transform = new Transform();
  transform.position.copy(position);

  // ThreeMesh component
  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

  // RigidBody component
  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();

  // Collider component
  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.ball(radius);

  entity
    .add(transform)
    .add(threeMesh)
    .add(rigidBody)
    .add(collider);

  return entity;
}
