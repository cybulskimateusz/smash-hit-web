import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import TubePathManager from '@src/managers/TubePathManager';
import * as PREFABS from '@src/prefabs';
import { TUBE_DEFAULTS } from '@src/prefabs/createTubeSegment';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class SpawnTubeSegmentsSystem extends System {
  private segmentIndex = 0;
  private readonly lookAheadDistance = 5000;

  // Track the end of the last segment for seamless connections
  private nextStartPoint = new THREE.Vector3(0, 0, 0);
  private nextStartTangent = new THREE.Vector3(0, 0, -1);

  constructor() {
    super();
    autoBind(this);
  }

  init(): void {
    this.spawnSegmentsAhead(0);
  }

  update(time: number): void {
    this.spawnSegmentsAhead(time);
  }

  private spawnSegmentsAhead(time: number): void {
    const distanceTraveled = time * TUBE_DEFAULTS.speed;
    const targetDistance = distanceTraveled + this.lookAheadDistance;

    while (TubePathManager.instance.getTotalLength() < targetDistance) {
      this.spawnSegment();
    }
  }

  private spawnSegment(): void {
    const result = PREFABS.createTubeSegment(this.world, {
      startPoint: this.nextStartPoint.clone(),
      startTangent: this.nextStartTangent.clone(),
      segmentIndex: this.segmentIndex++,
    });

    // Update for next segment
    this.nextStartPoint.copy(result.endPoint);
    this.nextStartTangent.copy(result.endTangent);
  }

  onEntityRemoved(_entity: Entity): void {}
}
