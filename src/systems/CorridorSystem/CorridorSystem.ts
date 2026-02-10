import CameraRail from '@src/components/CameraRail';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import createCorridor from '@src/prefabs/createCorridor';
import autoBind from 'auto-bind';

/**
 * Creates TubeGeometry around incoming CameraRails
 */
export default class extends System {
  private corridorCreated: Entity[] = [];

  init(): void {
    autoBind(this);
  }

  update(_time: number): void {
    this.query(CameraRail).forEach(this.spawnCorridor);
  }

  spawnCorridor(entity: Entity) {
    if (this.corridorCreated.includes(entity)) return;

    const { rail } = entity.get(CameraRail)!;
    createCorridor(this.world, { curve: rail, segmentIndex: this.corridorCreated.length });
    this.corridorCreated.push(entity);
  }

  onEntityRemoved(_entity: Entity): void {}
}