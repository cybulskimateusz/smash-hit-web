import Transform from '@src/components/Transform';
import TestableScene from '@testable/TestableScene';

import RenderSystem from '../RenderSystem';
import CameraMovementSystem from './CameraMovementSystem';

export default class extends TestableScene {
  static path = '/system/CameraMovementSystem';

  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new CameraMovementSystem(this.camera));

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