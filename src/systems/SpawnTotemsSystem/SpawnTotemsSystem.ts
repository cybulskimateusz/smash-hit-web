import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import TubePathManager from '@src/managers/TubePathManager';
import * as PREFABS from '@src/prefabs';
import { TUBE_DEFAULTS } from '@src/prefabs/createTubeSegment';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class SpawnTotemsSystem extends System {
  private lastSpawnDistance = 0;
  private readonly spawnInterval = 300;
  private readonly spawnRadius = TUBE_DEFAULTS.radius * 0.5;
  private readonly spawnAheadDistance = 100;

  constructor() {
    super();
    autoBind(this);
  }

  init(): void {}

  update(time: number): void {
    const distanceTraveled = time * TUBE_DEFAULTS.speed;
    const spawnAtDistance = distanceTraveled + this.spawnAheadDistance;

    while (this.lastSpawnDistance < spawnAtDistance) {
      this.lastSpawnDistance += this.spawnInterval;
      this.spawnObstacle(this.lastSpawnDistance);
    }
  }

  private spawnObstacle(distance: number): void {
    const pathManager = TubePathManager.instance;

    // Get position and orientation along the tube path
    const pathPosition = pathManager.getPositionAt(distance);
    const tangent = pathManager.getTangentAt(distance);

    // Create perpendicular vectors for placing obstacles around the tube
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const realUp = new THREE.Vector3().crossVectors(right, tangent).normalize();

    // Spawn obstacles at random angles around the tube center
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = angle1 + Math.PI;

    const offset1 = new THREE.Vector3()
      .addScaledVector(right, Math.cos(angle1) * this.spawnRadius)
      .addScaledVector(realUp, Math.sin(angle1) * this.spawnRadius);

    const offset2 = new THREE.Vector3()
      .addScaledVector(right, Math.cos(angle2) * this.spawnRadius)
      .addScaledVector(realUp, Math.sin(angle2) * this.spawnRadius);

    PREFABS.createSplittableGlass(this.world, {
      position: pathPosition.clone().add(offset1)
    });
    PREFABS.createSplittableGlass(this.world, {
      position: pathPosition.clone().add(offset2)
    });
  }

  onEntityRemoved(_entity: Entity): void {}
}
