import CameraRail from '@src/components/CameraRail';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import createCorridor from '@src/prefabs/createCorridor';
import autoBind from 'auto-bind';

/**
 * Creates TubeGeometry around incoming CameraRails
 */
export default class extends System {
  private railToCorridorMap = new Map<Entity, Entity>();

  init(): void {
    autoBind(this);
  }

  update(_time: number): void {
    this.query(CameraRail).forEach(this.spawnCorridor);
  }

  spawnCorridor(entity: Entity) {
    if (this.railToCorridorMap.has(entity)) return;

    const { rail } = entity.get(CameraRail)!;
    const corridor = createCorridor(this.world, { curve: rail, segmentIndex: this.railToCorridorMap.size });
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