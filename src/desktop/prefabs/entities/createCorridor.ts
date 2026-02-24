import Collider from '@desktop/components/Collider';
import Corridor from '@desktop/components/Corridor';
import RigidBody from '@desktop/components/RigidBody';
import ThreeMesh from '@desktop/components/ThreeMesh';
import Transform from '@desktop/components/Transform';
import type Entity from '@desktop/core/Entity';
import type World from '@desktop/core/World';
import RAPIER from '@dimforge/rapier3d';
import DisplacementGlowingMaterial from
  '@src/desktop/materials/DisplacementGlowingMaterial/DisplacementGlowingMaterial';
import * as THREE from 'three';

import createStars from '../decorators/createStars';

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
  lightColor?: THREE.Color;
  curve: THREE.CubicBezierCurve3;
}

export interface CorridorSegmentResult {
  entity: Entity;
  endPoint: THREE.Vector3;
  endTangent: THREE.Vector3;
}

const createCorridorMaterial = (lightColor: THREE.Color) => {
  const material = new DisplacementGlowingMaterial();
  material.side = THREE.DoubleSide;
  material.glowColor = lightColor;
  return material;
};

export const CORRIDOR_DEFAULT_OPTIONS: Omit<CorridorSegmentOptions, 'curve'> = {
  radius: 50,
  length: 100000,
  radialSegments: 6,
  tubularSegments: 3,
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

  // Randomly remove one wall for every second segment to create a gap
  if ((corridorProperties.segmentIndex! + 1) % 2 === 0) {
    const { radialSegments, tubularSegments } = corridorProperties;
    const wallToHide = Math.floor(Math.random() * radialSegments!);
    const indices = geometry.index!.array;
    const newIndices: number[] = [];

    for (let i = 0; i < tubularSegments!; i++) {
      for (let j = 0; j < radialSegments!; j++) {
        if (j === wallToHide) continue;

        const offset = (i * radialSegments! + j) * 6;
        for (let k = 0; k < 6; k++) {
          newIndices.push(indices[offset + k]);
        }
      }
    }
    geometry.setIndex(newIndices);
  }

  const material = options.material ||
  createCorridorMaterial(options.lightColor || new THREE.Color().setHSL(Math.random(), 0.8, 0.5));

  const mesh = new THREE.Mesh(geometry, material);

  const transform = new Transform();
  transform.position.set(0, 0, 0);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;
  mesh.add(createStars(corridorProperties.curve, 100, corridorProperties.radius! * 2));

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
