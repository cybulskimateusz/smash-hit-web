import Entity from './Entity';
import type System from './System';

class World {
  entities: Entity[] = [];
  systems: System[] = [];
  
  createEntity(): Entity {
    const entity = new Entity();
    this.entities.push(entity);
    return entity;
  }
  
  destroyEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index === -1) return;
    
    const removedEntity = this.entities.at(index)!;
    this.entities.splice(index, 1);
    this.systems.forEach(
      system => system.onEntityRemoved(removedEntity)
    );
  }
  
  addSystem(system: System): void {
    system.world = this;
    this.systems.push(system);
    system.init?.();
  }
  
  update(): void {
    this.systems.forEach(system => system.enabled && system.update());
  }
}

export default World;