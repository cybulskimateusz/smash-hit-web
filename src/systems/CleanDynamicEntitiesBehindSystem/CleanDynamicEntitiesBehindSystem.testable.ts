import TestableScene from '@testable/TestableScene';

import RenderSystem from '../RenderSystem';
import SpawnTotemsSystem from '../SpawnTotemsSystem/SpawnTotemsSystem';
import CleanEntitiesBehindSystem from './CleanDynamicEntitiesBehindSystem';

export default class extends TestableScene {
  static path = '/systems/CleanDynamicEntitiesBehindSystem';

  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new SpawnTotemsSystem(this.camera))
      .addSystem(new CleanEntitiesBehindSystem(this.camera));

    this.spawnFloor();
    this.camera.position.set(0, 0, 10);
    this.addKeyboardControls();
  }

  private addKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') this.camera.position.z -= 1;
      if (e.key === 'ArrowDown') this.camera.position.z += 1;
    });
  }
}