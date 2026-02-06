import RAPIER from '@dimforge/rapier3d';
import GlassMaterial from '@src/materials/GlassMaterial/GlassMaterial';
import * as THREE from 'three';

import Collider from '../components/Collider';
import MeshSplitter from '../components/MeshSplitter';
import RigidBody from '../components/RigidBody';
import ThreeMesh from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../core/Entity';
import type World from '../core/World';

export interface SplittableGlassOptions {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  splitAmount?: number;
  isStatic?: boolean;
}

export default function createSplittableGlass(
  world: World,
  options: SplittableGlassOptions = {}
): Entity {
  const {
    position = new THREE.Vector3(0, 0, -2),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    geometry = new THREE.IcosahedronGeometry(2, 1),
    material = new GlassMaterial(),
    splitAmount = 15,
  } = options;

  const entity = world.createEntity();

  const transform = new Transform();
  transform.position.copy(position);
  transform.rotation.copy(rotation);
  transform.scale.copy(scale);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.rotation.copy(rotation);
  mesh.scale.copy(scale);

  const threeMesh = new ThreeMesh();
  threeMesh.usesGlobalUniforms = true;
  threeMesh.mesh = mesh;

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();
  rigidBody.gravityScale = 0;

  const hull = RAPIER.ColliderDesc.convexHull(
    geometry.attributes.position.array as Float32Array
  );
  if (!hull) throw new Error('Failed to create convex hull collider');

  const collider = new Collider();
  collider.desc = hull;
  collider.desc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  const meshSplitter = new MeshSplitter();
  meshSplitter.amount = splitAmount;

  entity
    .add(transform)
    .add(threeMesh)
    .add(rigidBody)
    .add(collider)
    .add(meshSplitter);

  return entity;
}
