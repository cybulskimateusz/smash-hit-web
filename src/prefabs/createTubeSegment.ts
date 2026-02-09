import RAPIER from '@dimforge/rapier3d';
import TubeSegment from '@src/components/TubeSegment';
import TubePathManager from '@src/managers/TubePathManager';
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
}

export interface TubeSegmentResult {
  entity: Entity;
  endPoint: THREE.Vector3;
  endTangent: THREE.Vector3;
}

export const TUBE_DEFAULTS = {
  radius: 50,
  length: 200,
  radialSegments: 6,
  tubularSegments: 64,
  turnStrength: 0.4,
  speed: 100,
};

function getRandomTurnDirection(tangent: THREE.Vector3): THREE.Vector3 {
  // Get horizontal vector perpendicular to the tangent (left/right only)
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

  // Randomly turn left or right (no up/down to preserve gravity)
  const direction = Math.random() > 0.5 ? 1 : -1;
  return right.multiplyScalar(direction);
}

export default function createTubeSegment(
  world: World,
  options: TubeSegmentOptions = {}
): TubeSegmentResult {
  const {
    startPoint = new THREE.Vector3(0, 0, 0),
    startTangent = new THREE.Vector3(0, 0, -1).normalize(),
    turnDirection = getRandomTurnDirection(startTangent),
    radius = TUBE_DEFAULTS.radius,
    length = TUBE_DEFAULTS.length,
    radialSegments = TUBE_DEFAULTS.radialSegments,
    tubularSegments = TUBE_DEFAULTS.tubularSegments,
    turnStrength = TUBE_DEFAULTS.turnStrength,
    segmentIndex = 0,
  } = options;

  const entity = world.createEntity();

  // Create a smooth cubic bezier curve
  // P0 = start point
  // P1 = start + tangent * (length/3) - ensures smooth entry
  // P2 = end - endTangent * (length/3) - ensures smooth exit
  // P3 = end point

  const p0 = startPoint.clone();
  const p1 = startPoint.clone().addScaledVector(startTangent, length / 3);

  // Calculate end tangent by blending start tangent with turn direction
  const endTangent = startTangent.clone()
    .addScaledVector(turnDirection, turnStrength)
    .normalize();

  // End point follows the curved path
  const p3 = startPoint.clone()
    .addScaledVector(startTangent, length * 0.7)
    .addScaledVector(turnDirection, length * turnStrength * 0.5)
    .addScaledVector(endTangent, length * 0.3);

  const p2 = p3.clone().addScaledVector(endTangent, -length / 3);

  const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);

  // Visual representation of the curve (debug line)
  const curvePoints = curve.getPoints(200);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const curveMaterial = new THREE.LineBasicMaterial({ color: 'PURPLE' });
  const curveLine = new THREE.Line(curveGeometry, curveMaterial);

  // Visualize control points as spheres
  const controlPointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const controlPointGeometry = new THREE.SphereGeometry(3);
  const controlPoints = [p0, p1, p2, p3];
  const controlPointGroup = new THREE.Group();
  controlPoints.forEach((point) => {
    const sphere = new THREE.Mesh(controlPointGeometry, controlPointMaterial);
    sphere.position.copy(point);
    controlPointGroup.add(sphere);
  });

  // Visualize control polygon (lines connecting p0-p1-p2-p3)
  const controlPolygonGeometry = new THREE.BufferGeometry().setFromPoints([p0, p1, p2, p3]);
  const controlPolygonMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const controlPolygonLine = new THREE.Line(controlPolygonGeometry, controlPolygonMaterial);

  // Register curve with path manager for camera to follow
  const startDistance = TubePathManager.instance.addSegment(curve);

  // Create tube geometry following the curve
  const geometry = new THREE.TubeGeometry(
    curve,
    tubularSegments,
    radius,
    radialSegments,
    false
  );

  // Material with BackSide to render interior - each segment gets a different color
  const hue = (segmentIndex * 0.1) % 1;
  const color = new THREE.Color().setHSL(hue, 0.6, 0.5);
  const material = new THREE.MeshStandardMaterial({ color });
  material.side = THREE.BackSide;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.add(curveLine);
  mesh.add(controlPointGroup);
  mesh.add(controlPolygonLine);

  const transform = new Transform();
  transform.position.set(0, 0, 0);

  const threeMesh = new ThreeMesh();
  threeMesh.mesh = mesh;

  const rigidBody = new RigidBody();
  rigidBody.desc = RAPIER.RigidBodyDesc.fixed();

  // Collider - trimesh from geometry
  const positionAttr = geometry.attributes.position;
  const vertices = new Float32Array(positionAttr.array);
  const indices = new Uint32Array(geometry.index!.array);

  const collider = new Collider();
  collider.desc = RAPIER.ColliderDesc.trimesh(vertices, indices);

  const tubeSegment = new TubeSegment();
  tubeSegment.segmentIndex = segmentIndex;
  tubeSegment.startDistance = startDistance;

  entity
    .add(transform)
    .add(rigidBody)
    .add(collider)
    .add(threeMesh)
    .add(tubeSegment);

  // Use actual curve endpoints for perfect continuity
  return {
    entity,
    endPoint: curve.getPointAt(1),
    endTangent: curve.getTangentAt(1).normalize(),
  };
}
