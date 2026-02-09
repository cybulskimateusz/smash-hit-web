import GameScene from '@src/components/GameScene';
import CameraMovementSystem from '@src/systems/CameraMovementSystem/CameraMovementSystem';
import CleanDynamicEntitiesBehindSystem from
  '@src/systems/CleanDynamicEntitiesBehindSystem/CleanDynamicEntitiesBehindSystem';
import CleanTubeSegmentsSystem from '@src/systems/CleanTubeSegmentsSystem/CleanTubeSegmentsSystem';
import GlobalUniformsMaterialsSystem from '@src/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import MeshSplitterOnCollisionSystem from '@src/systems/MeshSplitterOnCollisionSystem/MeshSplitterOnCollisionSystem';
import MeshSplitterSystem from '@src/systems/MeshSplitterSystem/MeshSplitterSystem';
import PhysicsDebrisSystem from '@src/systems/PhysicsDebrisSystem/PhysicsDebrisSystem';
import PhysicsSystem from '@src/systems/PhysicsSystem';
import RenderSystem from '@src/systems/RenderSystem';
import SpawnTotemsSystem from '@src/systems/SpawnTotemsSystem/SpawnTotemsSystem';
import SpawnTubeSegmentsSystem from '@src/systems/SpawnTubeSegmentsSystem/SpawnTubeSegmentsSystem';
import ThrowBallSystem from '@src/systems/ThrowBallSystem/ThrowBallSystem';
import * as THREE from 'three';

class MainScene extends GameScene {
  init(): void {
    // Ambient light for base illumination
    this.add(new THREE.AmbientLight(0xffffff, 2));

    // Directional light attached to camera - moves with it, no distance decay
    const cameraLight = new THREE.DirectionalLight(0xffffff, 3);
    cameraLight.position.set(0, 5, 5);
    this.world.camera.add(cameraLight);
    this.add(this.world.camera);
    
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new PhysicsSystem())
      .addSystem(new MeshSplitterSystem())
      .addSystem(new MeshSplitterOnCollisionSystem())
      .addSystem(new PhysicsDebrisSystem())
      .addSystem(new GlobalUniformsMaterialsSystem())
      .addSystem(new CameraMovementSystem())
      .addSystem(new SpawnTubeSegmentsSystem())
      .addSystem(new CleanTubeSegmentsSystem())
      .addSystem(new SpawnTotemsSystem())
      .addSystem(new ThrowBallSystem())
      .addSystem(new CleanDynamicEntitiesBehindSystem());
  }
}

export default MainScene;