import RAPIER from '@dimforge/rapier3d';
import Collider from '@src/components/Collider';
import OwnedBy from '@src/components/OwnedBy';
import RigidBody from '@src/components/RigidBody';
import Temporary from '@src/components/Temporary';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity';
import type World from '@src/core/World';
import * as THREE from 'three';

export interface BallOptions {
  position?: THREE.Vector3;
  radius?: number;
  color?: number;
  owner?: Entity;
}

export default function createBall(
  world: World,
  options: BallOptions = {}
): Entity {
  const {
    position = new THREE.Vector3(0, 0, 0),
    radius = 1,
    color = 0xff6600,
    owner,
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
  rigidBody.desc = RAPIER.RigidBodyDesc.dynamic().setCcdEnabled(true);

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

  if (owner) {
    const ownedBy = new OwnedBy();
    ownedBy.player = owner;
    entity.add(ownedBy);
  }

  return entity;
}
