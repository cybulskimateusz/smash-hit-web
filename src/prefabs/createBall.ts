import RAPIER from '@dimforge/rapier3d';
import Temporary from '@src/components/Temporary';
import * as THREE from 'three';

import Collider from '../components/Collider';
import RigidBody from '../components/RigidBody';
import ThreeMesh from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../core/Entity';
import type World from '../core/World';

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

  const transform = new Transform();
  transform.position.copy(position);

  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();

  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.ball(radius);

  const temporary =  new Temporary();
  temporary.lifespan = 5000;

  entity
    .add(transform)
    .add(threeMesh)
    .add(rigidBody)
    .add(collider)
    .add(temporary);

  return entity;
}
