import { Expose, Testable } from '@testable/index';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import  PhysicalMesh  from './PhysicalMesh';

@Testable({
  path: '/components/PhysicalMesh',
  useOrbitControls: true,
  useFbnBackground: true,
})
export default class extends PhysicalMesh {
  private animationFrame?: ReturnType<typeof requestAnimationFrame>;
  private initialPosition = new THREE.Vector3();
  private initialQuaternion = new THREE.Quaternion();

  @Expose({ folder: 'Settings', min: 0, max: 100, step: 1 })
  public get gravityScale() { return this.options.gravityScale || 1; }
  public set gravityScale(value: number) {
    this.options.gravityScale = value;
    this.rigidBody.setGravityScale(value, true);
  }

  @Expose({ folder: 'Triggers' })
  animate() {
    this.animationFrame = requestAnimationFrame(this.animate);
    window.app.world.step();
    const pos = this.rigidBody.translation();
    const rot = this.rigidBody.rotation();
    this.position.set(pos.x, pos.y, pos.z);
    this.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  }

  @Expose({ folder: 'Triggers' })
  reset() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.position.copy(this.initialPosition);
    this.quaternion.copy(this.initialQuaternion);
    this.rigidBody.setTranslation(this.initialPosition, true);
    this.rigidBody.setRotation(this.initialQuaternion, true);
    this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  constructor() {
    super(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial(), { gravityScale: 50 });
    autoBind(this);
    this.initialPosition.copy(this.position);
    this.initialQuaternion.copy(this.quaternion);
  }
}
