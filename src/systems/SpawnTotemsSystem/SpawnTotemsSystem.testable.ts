import TestableScene from '@testable/TestableScene';

import RenderSystem from '../RenderSystem';
import SpawnTotemsSystem from './SpawnTotemsSystem';

export default class extends TestableScene {
  static path = '/systems/SpawnTotemsSystem';

  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new SpawnTotemsSystem());

    this.spawnFloor();
    this.world.camera.position.set(0, 0, 10);
    this.addKeyboardControls();
  }

  private addKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') this.world.camera.position.z -= 1;
      if (e.key === 'ArrowDown') this.world.camera.position.z += 1;
    });
  }
}