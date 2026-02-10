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

export interface TotemOptions {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  splitAmount?: number;
}

const TOTEM_GEOMETRIES = {
  box: new THREE.BoxGeometry(3, 4, 3),
  icosahedron: new THREE.IcosahedronGeometry(2, 1),
  sphere: new THREE.IcosahedronGeometry(3, 1),
};

const TOTEM_DEFAULT_PROPS: TotemOptions = {
  position: new THREE.Vector3(0, 0, -2),
  rotation: new THREE.Euler(0, 0, 0),
  scale: new THREE.Vector3(1, 1, 1),
  material: new GlassMaterial(),
  splitAmount: 15,
};

function getRandomGeometry(): THREE.BufferGeometry {
  const geometries = Object.values(TOTEM_GEOMETRIES);
  return geometries[Math.floor(Math.random() * geometries.length)];
}

export default function createTotem(
  world: World,
  options: TotemOptions = {}
): Entity {
  const props = {
    ...TOTEM_DEFAULT_PROPS,
    ...options,
    geometry: options.geometry ?? getRandomGeometry(),
  };

  const entity = world.createEntity();

  const transform = new Transform();
  transform.position.copy(props.position!);
  transform.rotation.copy(props.rotation!);
  transform.scale.copy(props.scale!);

  const mesh = new THREE.Mesh(props.geometry, props.material);
  mesh.position.copy(props.position!);
  mesh.rotation.copy(props.rotation!);
  mesh.scale.copy(props.scale!);

  const threeMesh = new ThreeMesh();
  threeMesh.usesGlobalUniforms = true;
  threeMesh.mesh = mesh;

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();
  rigidBody.gravityScale = 0;

  const hull = RAPIER.ColliderDesc.convexHull(
    props.geometry!.attributes.position.array as Float32Array
  );
  if (!hull) throw new Error('Failed to create convex hull collider');

  const collider = new Collider();
  collider.desc = hull;
  collider.desc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

  const meshSplitter = new MeshSplitter();
  meshSplitter.amount = props.splitAmount!;

  entity
    .add(transform)
    .add(threeMesh)
    .add(rigidBody)
    .add(collider)
    .add(meshSplitter);

  return entity;
}
