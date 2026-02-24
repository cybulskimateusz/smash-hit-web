import Collider from '@desktop/components/Collider';
import OwnedBy from '@desktop/components/OwnedBy';
import RigidBody from '@desktop/components/RigidBody';
import Temporary from '@desktop/components/Temporary';
import ThreeMesh from '@desktop/components/ThreeMesh';
import Transform from '@desktop/components/Transform';
import type Entity from '@desktop/core/Entity';
import type World from '@desktop/core/World';
import RAPIER from '@dimforge/rapier3d';
import Audible from '@src/desktop/components/Audible';
import DisplacementGlowingMaterial from 
  '@src/desktop/materials/DisplacementGlowingMaterial/DisplacementGlowingMaterial';
import * as THREE from 'three';

export interface BallOptions {
  position?: THREE.Vector3;
  radius?: number;
  color?: THREE.ColorRepresentation;
  owner?: Entity;
}

// if amount of collisions > 2 remove rigidbody
// not musch users care about the ball anymore, 
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
  const material = new DisplacementGlowingMaterial();
  material.color = new THREE.Color(color);
  material.emissionRatio = 10;
  material.glowColor = new THREE.Color(color);
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

  const audible = new Audible();
  audible.audio = 'shot';

  entity
    .add(transform)
    .add(threeMesh)
    .add(rigidBody)
    .add(collider)
    .add(temporary)
    .add(audible);

  if (owner) {
    const ownedBy = new OwnedBy();
    ownedBy.owner = owner;
    entity.add(ownedBy);
  }

  return entity;
}
