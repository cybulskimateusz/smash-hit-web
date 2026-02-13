import CameraRail from '@desktop/components/CameraRail';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import createCorridor, { type CorridorSegmentOptions } from '@desktop/prefabs/entities/createCorridor';
import autoBind from 'auto-bind';

/**
 * Creates TubeGeometry around incoming CameraRails
 */
export default class extends System {
  private railToCorridorMap = new Map<Entity, Entity>();
  public corridorOptions: Omit<CorridorSegmentOptions, 'curve' | 'segmentIndex'> = {};

  init(): void {
    autoBind(this);
  }

  update(_time: number): void {
    this.query(CameraRail).forEach(this.spawnCorridor);
  }

  spawnCorridor(entity: Entity) {
    if (this.railToCorridorMap.has(entity)) return;

    const { rail } = entity.get(CameraRail)!;
    const corridor = createCorridor(this.world, {
      ...this.corridorOptions,
      curve: rail,
      segmentIndex: this.railToCorridorMap.size
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