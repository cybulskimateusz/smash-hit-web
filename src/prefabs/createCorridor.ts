import RAPIER from '@dimforge/rapier3d';
import Corridor from '@src/components/Corridor';
import FireflyMaterial from '@src/materials/FireflyMaterial/FireflyMaterial';
import MetalPlateMaterial from '@src/materials/MetalPlateMateral/MetalPlateMateral';
import * as THREE from 'three';

import Collider from '../components/Collider';
import RigidBody from '../components/RigidBody';
import ThreeMesh from '../components/ThreeMesh';
import Transform from '../components/Transform';
import type Entity from '../core/Entity';
import type World from '../core/World';

export interface TubeSegmentOptions {
  startPoint?: THREE.Vector3;
  startTangent?: THREE.Vector3;
  turnDirection?: THREE.Vector3;
  radius?: number;
  length?: number;
  radialSegments?: number;
  tubularSegments?: number;
  turnStrength?: number;
  segmentIndex?: number;
  curve: THREE.CubicBezierCurve3;
}

export interface TubeSegmentResult {
  entity: Entity;
  endPoint: THREE.Vector3;
  endTangent: THREE.Vector3;
}

export const CORRIDOR_DEFAULT_OPTIONS = {
  radius: 20,
  length: 5000,
  radialSegments: 32,
  tubularSegments: 64,
  turnStrength: 0.4,
  segmentIndex: 0,
};

function createFireflies(curve: THREE.CubicBezierCurve3, radius: number, count = 50): THREE.Points {
  const positions: number[] = [];
  const offsets: number[] = [];

  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const point = curve.getPointAt(t);

    // Random offset within the corridor
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius * 0.7;
    point.x += Math.cos(angle) * r;
    point.y += Math.sin(angle) * r;

    positions.push(point.x, point.y, point.z);
    offsets.push(Math.random());
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(offsets, 1));

  const material = new FireflyMaterial();
  return new THREE.Points(geometry, material);
}

export default function createCorridor(
  world: World,
  options: TubeSegmentOptions
): Entity {
  const corridorProperties = { ...CORRIDOR_DEFAULT_OPTIONS, ...options };

  const entity = world.createEntity();

  const geometry = new THREE.TubeGeometry(
    corridorProperties.curve,
    corridorProperties.tubularSegments,
    corridorProperties.radius,
    corridorProperties.radialSegments,
    false
  );

  const material = new MetalPlateMaterial();
  material.side = THREE.BackSide;

  const mesh = new THREE.Mesh(geometry, material);

  const transform = new Transform();
  transform.position.set(0, 0, 0);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

  const fireflies = createFireflies(corridorProperties.curve, corridorProperties.radius);
  threeMesh.mesh.add(fireflies);
  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.fixed();

  const positionAttr = geometry.attributes.position;
  const vertices = new Float32Array(positionAttr.array);
  const indices = new Uint32Array(geometry.index!.array);

  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.trimesh(vertices, indices);

  const corridor = new Corridor();
  corridor.curve = corridorProperties.curve;
  corridor.radius = corridorProperties.radius;

  entity
    .add(transform)
    .add(rigidBody)
    .add(collider)
    .add(threeMesh)
    .add(corridor);

  return entity;
}
