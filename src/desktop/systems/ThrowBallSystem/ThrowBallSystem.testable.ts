import TestableScene from '@testable/TestableScene';

import PhysicsSystem from '../PhysicsSystem';
import RenderSystem from '../RenderSystem';
import ThrowBallSystem from './ThrowBallSystem';

export default class extends TestableScene {
  static path = '/systems/ThrowBallSystem';

  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new PhysicsSystem())
      .addSystem(new ThrowBallSystem());

    this.spawnFloor();
  }
}