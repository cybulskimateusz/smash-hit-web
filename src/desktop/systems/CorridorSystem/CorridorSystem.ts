import CameraRail from '@desktop/components/CameraRail';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import createCorridor, { type CorridorSegmentOptions } from '@desktop/prefabs/entities/createCorridor';
import Corridor from '@src/desktop/components/Corridor';
import ThreeMesh from '@src/desktop/components/ThreeMesh';
import GameSettingsManager from '@src/desktop/singletons/GameSettingsManager';
import autoBind from 'auto-bind';
import * as THREE from 'three';

const EMISSION_CHANGE_SPEED =  0.00001;

/**
 * Creates TubeGeometry around incoming CameraRails
 */
export default class extends System {
  private railToCorridorMap = new Map<Entity, Entity>();
  public corridorOptions: Omit<CorridorSegmentOptions, 'curve' | 'segmentIndex'> = {};

  private lightColor = new THREE.Color().setRGB(0.0, 1.0, 0.0);

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    const hue = (time * EMISSION_CHANGE_SPEED * GameSettingsManager.instance.difficulty) % 1;
    this.lightColor.setHSL(hue, 1.0, 0.5);

    this.query(CameraRail).forEach(this.spawnCorridor);
    this.query(Corridor).forEach(this.updateCorridor);
  }

  updateCorridor(entity: Entity) {
    const threeMesh = entity.get(ThreeMesh);

    if (!threeMesh || !('glowColor' in threeMesh.mesh.material)) return;
    threeMesh.mesh.material.glowColor = this.lightColor;
  }

  spawnCorridor(entity: Entity) {
    if (this.railToCorridorMap.has(entity)) return;

    const { rail } = entity.get(CameraRail)!;
    const corridor = createCorridor(this.world, {
      ...this.corridorOptions,
      curve: rail,
      segmentIndex: this.railToCorridorMap.size,
      lightColor: this.lightColor,
    });
    this.railToCorridorMap.set(entity, corridor);
  }

  onEntityRemoved(entity: Entity): void {
    const corridor = this.railToCorridorMap.get(entity);
    if (corridor) {
      this.world.destroyEntity(corridor);
      this.railToCorridorMap.delete(entity);
    }
  }
}