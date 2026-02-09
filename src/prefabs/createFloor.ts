import RAPIER from '@dimforge/rapier3d';
import TVNoiseMaterial from '@src/materials/TVNoiseMaterial/TVNoiseMaterial';
import * as THREE from 'three';

import Collider from '../components/Collider';
import RigidBody from '../components/RigidBody';
import ThreeMesh from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../core/Entity';
import type World from '../core/World';

export default function createSplittableGlass(
  world: World,
): Entity {
  const entity = world.createEntity();
  const floorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(500, 1, 500),
    new TVNoiseMaterial()
  );
  floorMesh.position.set(0, -5, 0);

  const transform = new Transform();
  transform.position.set(0, -5, 0);

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.fixed();

  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.cuboid(500, 1, 500);
    
  const threeMesh = new ThreeMesh();
  threeMesh.mesh = floorMesh;

  entity
    .add(transform)
    .add(rigidBody)
    .add(collider)
    .add(threeMesh);

  return entity;
}
