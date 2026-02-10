import RAPIER from '@dimforge/rapier3d';
import Corridor from '@src/components/Corridor';
// import getCurve from '@src/utils/three/getCurve/getCurve';
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
  radialSegments: 6,
  tubularSegments: 64,
  turnStrength: 0.4,
  segmentIndex: 0,
};

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

  const hue = (corridorProperties.segmentIndex * 0.1) % 1;
  const color = new THREE.Color().setHSL(hue, 0.6, 0.5);
  const material = new THREE.MeshLambertMaterial({ color });
  material.side = THREE.DoubleSide;

  const mesh = new THREE.Mesh(geometry, material);

  const transform = new Transform();
  transform.position.set(0, 0, 0);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

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
