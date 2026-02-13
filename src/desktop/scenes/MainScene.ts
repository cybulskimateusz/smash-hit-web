import GameScene from '@desktop/components/GameScene';
import CameraMovementSystem from '@desktop/systems/CameraMovementSystem/CameraMovementSystem';
import CameraRailGenerationSystem from '@desktop/systems/CameraRailGenerationSystem/CameraRailGenerationSystem';
import CleanTemporariesSystem from '@desktop/systems/CleanTemporariesSystem';
import CorridorSystem from '@desktop/systems/CorridorSystem/CorridorSystem';
import CrosshairSystem from '@desktop/systems/CrosshairSystem';
import GlobalUniformsMaterialsSystem from
  '@desktop/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import MeshSplitterOnCollisionSystem from
  '@desktop/systems/MeshSplitterOnCollisionSystem/MeshSplitterOnCollisionSystem';
import MeshSplitterSystem from '@desktop/systems/MeshSplitterSystem/MeshSplitterSystem';
import PhysicsDebrisSystem from '@desktop/systems/PhysicsDebrisSystem/PhysicsDebrisSystem';
import PhysicsSystem from '@desktop/systems/PhysicsSystem';
import PlayerRegistrationSystem from '@desktop/systems/PlayerRegistrationSystem';
import RenderSystem from '@desktop/systems/RenderSystem';
import SpawnTotemsSystem from '@desktop/systems/SpawnTotemsSystem/SpawnTotemsSystem';
import ThrowBallSystem from '@desktop/systems/ThrowBallSystem/ThrowBallSystem';
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
      .addSystem(new CrosshairSystem())
      .addSystem(new CameraRailGenerationSystem())
      .addSystem(new CorridorSystem())
      .addSystem(new CleanTemporariesSystem())
      .addSystem(new PlayerRegistrationSystem());

    this.addLights();
  }

  private addLights() {
    this.add(new THREE.AmbientLight(0xffffff, 0.5));

    const cameraLight = new THREE.DirectionalLight(0xffffff, 1);
    cameraLight.position.set(0, 5, 1);
    this.world.camera.add(cameraLight);
    this.add(this.world.camera);
  }
}

export default MainScene;