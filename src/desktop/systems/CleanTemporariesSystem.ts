import Temporary from '@desktop/components/Temporary';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import ClockManager from '@desktop/singletons/ClockManager';
import autoBind from 'auto-bind';

interface TimedEntity {
    time: number;
    entity: Entity;
}

class CleanTemporariesSystem extends System {
  private timedEntities: TimedEntity[] = [];

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    this.query(Temporary).forEach(this.registerEntity);
    this.destroyOutdated(time);
  }

  private destroyOutdated(time: number) {
    const outdated = this.timedEntities.filter(timedEntity => {
      const lifespan = timedEntity.entity.get(Temporary)!.lifespan;
      return lifespan + timedEntity.time < time;
    }).map(timed => timed.entity);

    outdated.forEach(entity => this.world.destroyEntity(entity));
  }

  private registerEntity(entity: Entity) {
    if (this.timedEntities.some(timed => timed.entity === entity)) return;
    this.timedEntities.push({ entity, time: ClockManager.instance.currentTime });
  }

  onEntityRemoved(_entity: Entity): void {}

}

export default CleanTemporariesSystem;