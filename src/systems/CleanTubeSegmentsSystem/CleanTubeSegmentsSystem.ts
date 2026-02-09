import TubeSegment from '@src/components/TubeSegment';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import { TUBE_DEFAULTS } from '@src/prefabs/createTubeSegment';
import autoBind from 'auto-bind';

const CLEANUP_DISTANCE = TUBE_DEFAULTS.length * 2;

export default class CleanTubeSegmentsSystem extends System {
  constructor() {
    super();
    autoBind(this);
  }

  update(time: number): void {
    const distanceTraveled = time * TUBE_DEFAULTS.speed;
    this.query(TubeSegment).forEach(entity => this.cleanupSegmentBehind(entity, distanceTraveled));
  }

  private cleanupSegmentBehind(entity: Entity, distanceTraveled: number): void {
    const tubeSegment = entity.get(TubeSegment);
    if (!tubeSegment) return;

    // Remove segment if camera has passed it by more than cleanup distance
    if (tubeSegment.startDistance + CLEANUP_DISTANCE < distanceTraveled) {
      this.world.destroyEntity(entity);
    }
  }

  init(): void {}
  onEntityRemoved(): void {}
}
