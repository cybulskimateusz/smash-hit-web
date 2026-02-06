import TestableScene from '@testable/TestableScene';

import PhysicsSystem from '../PhysicsSystem';
import RenderSystem from '../RenderSystem';
import ThrowBallSystem from './ThrowBallSystem';

export default class extends TestableScene {
  static path = '/systems/ThrowBallSystem';

  init(): void {
    const physicsSystem = new PhysicsSystem();

    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(physicsSystem)
      .addSystem(new ThrowBallSystem(this.camera, physicsSystem));

    this.spawnFloor();
  }
}