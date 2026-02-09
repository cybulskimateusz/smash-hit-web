import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import TubePathManager from '@src/managers/TubePathManager';
import { TUBE_DEFAULTS } from '@src/prefabs/createTubeSegment';
import * as THREE from 'three';

export default class extends System {
  private targetQuaternion = new THREE.Quaternion();
  private smoothingFactor = 0.08; // Lower = smoother rotation
  private readonly lookAheadDistances = [20, 40, 60]; // Multiple look-ahead points
  private readonly lookAheadWeights = [0.5, 0.3, 0.2]; // Weights for blending

  init(): void {}

  update(time: number): void {
    const distance = time * TUBE_DEFAULTS.speed;
    const pathManager = TubePathManager.instance;
    // console.log(this.world.camera);
    // Get position along the tube path
    const position = pathManager.getPositionAt(distance);
    this.world.camera.position.copy(position);

    // Blend tangents from multiple look-ahead points for smoother rotation
    const blendedTangent = new THREE.Vector3();
    for (let i = 0; i < this.lookAheadDistances.length; i++) {
      const lookAheadDist = distance + this.lookAheadDistances[i];
      const tangent = pathManager.getTangentAt(lookAheadDist);
      blendedTangent.addScaledVector(tangent, this.lookAheadWeights[i]);
    }
    blendedTangent.normalize().negate();

    const lookAtPoint = position.clone().add(blendedTangent.multiplyScalar(100));

    // Create a temporary object to calculate target quaternion
    const tempObj = new THREE.Object3D();
    tempObj.position.copy(position);
    tempObj.up.set(0, 1, 0); // Keep camera upright
    tempObj.lookAt(lookAtPoint);
    this.targetQuaternion.copy(tempObj.quaternion);

    // Smoothly interpolate camera rotation
    this.world.camera.quaternion.slerp(this.targetQuaternion, this.smoothingFactor);
  }

  onEntityRemoved(_entity: Entity): void {}
}
