import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import * as PREFABS from '@src/prefabs';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class SpawnTotemsSystem extends System {
  private lastSpawnTime = 0;
  private readonly spawnInterval = 5;

  constructor(private camera: THREE.Camera) {
    super();
    autoBind(this);
  }

  init(): void {}

  update(time: number): void {
    if (time - this.lastSpawnTime >= this.spawnInterval) {
      this.lastSpawnTime = time;
      const z = this.camera.position.z - 10;

      PREFABS.createSplittableGlass(this.world, {
        position: new THREE.Vector3(5, 0, z)
      });
      PREFABS.createSplittableGlass(this.world, {
        position: new THREE.Vector3(-5, 0, z)
      });
    }
  }

  onEntityRemoved(_entity: Entity): void {}
}
