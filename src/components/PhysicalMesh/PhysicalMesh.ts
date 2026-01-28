import RAPIER from '@dimforge/rapier3d';
import autoBind from 'auto-bind';
import * as THREE from 'three';

interface PhysicalMeshOptions {
  gravityScale?: number;
}

class PhysicalMesh extends THREE.Mesh {
  private collider: RAPIER.ColliderDesc;
  private _rigidBody: RAPIER.RigidBody;
  public get rigidBody() { return this._rigidBody; };

  constructor(
    geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>,
    material: THREE.Material,
    protected options: PhysicalMeshOptions = {}
  ) {
    super(geometry, material);
    autoBind(this);

    this._rigidBody = window.app.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setGravityScale(this.options.gravityScale || 1)
    );

    const collider =  RAPIER.ColliderDesc.convexHull(
        geometry.attributes.position.array as Float32Array
    );
    if (!collider) throw new Error('Failed to create collider.');
    this.collider = collider;
    window.app.world.createCollider(this.collider, this._rigidBody);
  }
}

export default PhysicalMesh;