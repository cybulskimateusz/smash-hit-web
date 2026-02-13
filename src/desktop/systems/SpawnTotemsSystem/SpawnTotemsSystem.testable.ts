import TestableScene from '@testable/TestableScene';

import CameraMovementSystem from '../CameraMovementSystem/CameraMovementSystem';
import CameraRailGenerationSystem from '../CameraRailGenerationSystem/CameraRailGenerationSystem';
import CorridorSystem from '../CorridorSystem/CorridorSystem';
import { testedCorridorMaterial } from '../CorridorSystem/CorridorSystem.testable';
import RenderSystem from '../RenderSystem';
import SpawnTotemsSystem from './SpawnTotemsSystem';

export default class extends TestableScene {
  static path = '/systems/SpawnTotemsSystem';

  init(): void {
    const corridorSystem = new CorridorSystem();
    corridorSystem.corridorOptions = { material: testedCorridorMaterial };
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new CameraRailGenerationSystem())
      .addSystem(new CameraMovementSystem())
      .addSystem(corridorSystem)
      .addSystem(new SpawnTotemsSystem());
  }
}