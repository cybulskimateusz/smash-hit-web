import ClockManager from '@desktop/singletons/ClockManager';
import * as THREE from 'three';

import Entity from './Entity';
import type System from './System';

class World {
  entities: Entity[] = [];
  systems: System[] = [];

  clockManager = ClockManager.instance;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
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
  
  addSystem(system: System): World {
    system.world = this;
    this.systems.push(system);
    system.init?.();

    return this;
  }
  
  update(): void {
    this.systems.forEach(system => system.enabled && system.update(this.clockManager.currentTime));
  }
}

export default World;