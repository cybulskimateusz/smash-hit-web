import * as THREE from 'three';

import CameraRailGenerationSystemTestable from '../CameraRailGenerationSystem/CameraRailGenerationSystem.testable';
import CorridorSystem from './CorridorSystem';

const testedCorridorMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
export default class extends CameraRailGenerationSystemTestable {
  static path = '/systems/CorridorSystem';
  private corridorSystem = new CorridorSystem();

  init(): void {
    super.init();

    this.corridorSystem.corridorOptions = { material: testedCorridorMaterial };

    this.world
      .addSystem(this.corridorSystem);
  }

  update(): void {
    super.update();
  }
}