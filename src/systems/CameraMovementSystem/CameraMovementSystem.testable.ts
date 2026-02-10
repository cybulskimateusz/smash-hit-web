import Transform from '@src/components/Transform';
import TestableScene from '@testable/TestableScene';

import CameraRailGenerationSystem from '../CameraRailGenerationSystem/CameraRailGenerationSystem';
import RenderSystem from '../RenderSystem';
import CameraMovementSystem from './CameraMovementSystem';

export default class extends TestableScene {
  static path = '/systems/CameraMovementSystem';

  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new CameraRailGenerationSystem())
      .addSystem(new CameraMovementSystem());

    this.spawnFloor();
    this.createDumb();
  }

  private createDumb() {
    const dumbEntity = this.spawnTotemEntity();
    const transform = dumbEntity?.get(Transform);
    if (!transform) return;
    transform.position.z = -20;
  }
}