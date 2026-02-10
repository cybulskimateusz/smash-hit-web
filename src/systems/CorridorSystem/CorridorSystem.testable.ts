import CameraRailGenerationSystemTestable from '../CameraRailGenerationSystem/CameraRailGenerationSystem.testable';
import CorridorSystem from './CorridorSystem';

export default class extends CameraRailGenerationSystemTestable {
  static path = '/systems/CorridorSystem';

  init(): void {
    super.init();
    this.world
      .addSystem(new CorridorSystem());
  }
}