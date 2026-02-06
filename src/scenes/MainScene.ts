import GameScene from '@src/components/GameScene';
import * as PREFABS from '@src/prefabs';
import CameraMovementSystem from '@src/systems/CameraMovementSystem/CameraMovementSystem';
import GlobalUniformsMaterialsSystem from '@src/systems/GlobalUniformsMaterialsSystem/GlobalUniformsMaterialsSystem';
import MeshSplitterOnCollisionSystem from '@src/systems/MeshSplitterOnCollisionSystem/MeshSplitterOnCollisionSystem';
import MeshSplitterSystem from '@src/systems/MeshSplitterSystem/MeshSplitterSystem';
import PhysicsDebrisSystem from '@src/systems/PhysicsDebrisSystem/PhysicsDebrisSystem';
import PhysicsSystem from '@src/systems/PhysicsSystem';
import RenderSystem from '@src/systems/RenderSystem';
import SpawnTotemsSystem from '@src/systems/SpawnTotemsSystem/SpawnTotemsSystem';

class MainScene extends GameScene {
  init(): void {
    this.world
      .addSystem(new RenderSystem(this))
      .addSystem(new PhysicsSystem())
      .addSystem(new MeshSplitterSystem())
      .addSystem(new MeshSplitterOnCollisionSystem())
      .addSystem(new PhysicsDebrisSystem())
      .addSystem(new GlobalUniformsMaterialsSystem())
      .addSystem(new CameraMovementSystem(this.camera))
      .addSystem(new SpawnTotemsSystem(this.camera));

    PREFABS.createFloor(this.world);
  }
}

export default MainScene;