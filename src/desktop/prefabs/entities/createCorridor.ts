import Collider from '@desktop/components/Collider';
import Corridor from '@desktop/components/Corridor';
import RigidBody from '@desktop/components/RigidBody';
import ThreeMesh from '@desktop/components/ThreeMesh';
import Transform from '@desktop/components/Transform';
import type Entity from '@desktop/core/Entity';
import type World from '@desktop/core/World';
import MetalPlateMaterial from '@desktop/materials/MetalPlateMateral/MetalPlateMateral';
import createFireflies from '@desktop/prefabs/decorators/createFireflies';
import RAPIER from '@dimforge/rapier3d';
import * as THREE from 'three';

export interface CorridorSegmentOptions {
  startPoint?: THREE.Vector3;
  startTangent?: THREE.Vector3;
  turnDirection?: THREE.Vector3;
  radius?: number;
  length?: number;
  radialSegments?: number;
  tubularSegments?: number;
  turnStrength?: number;
  segmentIndex?: number;
  material?: THREE.Material;
  curve: THREE.CubicBezierCurve3;
}

export interface CorridorSegmentResult {
  entity: Entity;
  endPoint: THREE.Vector3;
  endTangent: THREE.Vector3;
}

const createCorridorMaterial = () => {
  const corridorMaterial = new MetalPlateMaterial();
  corridorMaterial.side = THREE.BackSide;
  return corridorMaterial;
};

export const CORRIDOR_DEFAULT_OPTIONS: Omit<CorridorSegmentOptions, 'curve'> = {
  radius: 20,
  length: 5000,
  radialSegments: 32,
  tubularSegments: 64,
  turnStrength: 0.4,
  segmentIndex: 0,
};

export default function createCorridor(
  world: World,
  options: CorridorSegmentOptions
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
  const material = options.material || createCorridorMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  const transform = new Transform();
  transform.position.set(0, 0, 0);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

  threeMesh.mesh.add(createFireflies({
    curve: corridorProperties.curve,
    radius: corridorProperties.radius!
  }));

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.fixed();

  const positionAttr = geometry.attributes.position;
  const vertices = new Float32Array(positionAttr.array);
  const indices = new Uint32Array(geometry.index!.array);

  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.trimesh(vertices, indices);

  const corridor = new Corridor();
  corridor.curve = corridorProperties.curve;
  corridor.radius = corridorProperties.radius!;

  entity
    .add(transform)
    .add(rigidBody)
    .add(collider)
    .add(threeMesh)
    .add(corridor);

  return entity;
}
