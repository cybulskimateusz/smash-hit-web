import type Entity from './Entity';
import type World from './World';

abstract class System {
  world!: World;
  enabled = true;

  init?(): void;
  abstract update(time: number): void;
  
  query(...components: EntityComponentType<unknown>[]): Entity[] {
    return this.world.entities.filter(entity =>
      components.every(component => entity.has(component))
    );
  }

  abstract onEntityRemoved(entity: Entity): void;
}

export default System;