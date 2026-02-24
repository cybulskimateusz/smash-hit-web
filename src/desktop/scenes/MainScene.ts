import GameScene from '@desktop/components/GameScene';
import CameraMovementSystem from '@desktop/systems/CameraMovementSystem/CameraMovementSystem';
import CameraRailGenerationSystem from '@desktop/systems/CameraRailGenerationSystem/CameraRailGenerationSystem';
import CleanTemporariesSystem from '@desktop/systems/CleanTemporariesSystem';
import CorridorSystem from '@desktop/systems/CorridorSystem/CorridorSystem';
import GlobalUniformsMaterialsSystem from
  '@desktop/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import MeshSplitterOnCollisionSystem from
  '@desktop/systems/MeshSplitterOnCollisionSystem/MeshSplitterOnCollisionSystem';
import MeshSplitterSystem from '@desktop/systems/MeshSplitterSystem/MeshSplitterSystem';
import PhysicsDebrisSystem from '@desktop/systems/PhysicsDebrisSystem/PhysicsDebrisSystem';
import PhysicsSystem from '@desktop/systems/PhysicsSystem';
import PlayerRegistrationSystem from '@desktop/systems/PlayerRegistrationSystem';
import RenderSystem from '@desktop/systems/RenderSystem';
import ScoringSystem from '@desktop/systems/ScoringSystem';
import SpawnTotemsSystem from '@desktop/systems/SpawnTotemsSystem/SpawnTotemsSystem';
import ThrowBallSystem from '@desktop/systems/ThrowBallSystem';
import * as THREE from 'three';

class MainScene extends GameScene {
  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new PhysicsSystem())
      .addSystem(new MeshSplitterSystem())
      .addSystem(new MeshSplitterOnCollisionSystem())
      .addSystem(new PhysicsDebrisSystem())
      .addSystem(new GlobalUniformsMaterialsSystem())
      .addSystem(new CameraMovementSystem())
      .addSystem(new SpawnTotemsSystem())
      .addSystem(new ThrowBallSystem())
      .addSystem(new CameraRailGenerationSystem())
      .addSystem(new CorridorSystem())
      .addSystem(new CleanTemporariesSystem())
      .addSystem(new PlayerRegistrationSystem())
      .addSystem(new ScoringSystem());

    this.add(this.world.camera);
    this.background = new THREE.Color(0x03000e);
  }
}

export default MainScene;