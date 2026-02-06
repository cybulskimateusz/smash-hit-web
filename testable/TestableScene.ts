import RAPIER from '@dimforge/rapier3d';
import Collider from '@src/components/Collider';
import GameScene from '@src/components/GameScene';
import MeshSplitter from '@src/components/MeshSplitter';
import RigidBody from '@src/components/RigidBody';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/Entity';
import type World from '@src/World';
import autoBind from 'auto-bind';
import * as THREE from 'three';

abstract class TestableScene extends GameScene {
  static path: string;
  
  constructor(world: World, canvas: HTMLCanvasElement) {
    super(world, canvas);
    autoBind(this);
  }
  
  protected  spawnFloor(): Entity {
    const entity = this.world.createEntity();
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(500, 1, 500),
      new THREE.MeshNormalMaterial()
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

  public spawnBall(): Entity {
    const ballEntity = this.world.createEntity();
    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshNormalMaterial()
    );

    const threeMesh = new ThreeMesh();
    threeMesh.mesh = ballMesh;

    const transform = new Transform();
    transform.position.copy(this.camera.position);

    const rigidBody = new RigidBody();
    rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();

    const collider = new Collider();
    collider.desc = RAPIER.ColliderDesc.ball(0.3);

    ballEntity
      .add(threeMesh)
      .add(transform)
      .add(rigidBody)
      .add(collider);

    return ballEntity;
  }

  public spawnTotemEntity(): Entity | undefined {
    const entity = this.world.createEntity();
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.MeshNormalMaterial()
    );
    mesh.position.set(5, 0, 0);
    
    const threeMesh = new ThreeMesh();
    threeMesh.mesh = mesh;
    
    const transform = new Transform();
    transform.position.copy(mesh.position);
    
    const rigidBody = new RigidBody();
    rigidBody.desc = RAPIER.RigidBodyDesc.dynamic();
    rigidBody.gravityScale = 0;
    
    const geo = mesh.geometry;
    const hull = RAPIER.ColliderDesc.convexHull(
          geo.attributes.position.array as Float32Array
    );
    if (!hull) return;
    
    const collider = new Collider();
    collider.desc = hull;
    collider.desc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    
    entity
      .add(threeMesh)
      .add(transform)
      .add(collider)
      .add(rigidBody)
      .add(new MeshSplitter());
    
    return entity;
  }
}

export default TestableScene;