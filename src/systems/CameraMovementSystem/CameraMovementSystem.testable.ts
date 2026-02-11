import Transform from '@src/components/Transform';
import GameSettingsManager from '@src/managers/GameSettingsManager';
import TestableScene from '@testable/TestableScene';
import { GUI } from 'dat.gui';
import * as THREE from 'three';

import CameraRailGenerationSystem from '../CameraRailGenerationSystem/CameraRailGenerationSystem';
import CorridorSystem from '../CorridorSystem/CorridorSystem';
import RenderSystem from '../RenderSystem';
import CameraMovementSystem from './CameraMovementSystem';

export default class extends TestableScene {
  static path = '/systems/CameraMovementSystem';
  private currentScore = 0;

  init(): void {
    const corridorSystem = new CorridorSystem();
    const corridorMaterial = new THREE.MeshNormalMaterial();
    corridorMaterial.side = THREE.DoubleSide;
    corridorSystem.corridorOptions = { material: corridorMaterial };

    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new CameraRailGenerationSystem())
      .addSystem(corridorSystem)
      .addSystem(new CameraMovementSystem());

    this.spawnFloor();
    this.createDumb();
    this.addGUI();
  }

  private createDumb() {
    const dumbEntity = this.spawnTotemEntity();
    const transform = dumbEntity?.get(Transform);
    if (!transform) return;
    transform.position.z = -20;
  }

  protected incrementScore() {
    this.currentScore++;
    GameSettingsManager.instance.incrementDifficultyForScore(this.currentScore);
  }

  protected addGUI() {
    new GUI().add({
      incrementScore: this.incrementScore
    }, 'incrementScore').name('Increment player score');
  }
}