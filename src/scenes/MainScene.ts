import GameScene from '../components/GameScene';
import { createBall, createSplittableGlass } from '../prefabs';
import MeshSplitterOnCollisionSystem from '../systems/MeshSplitterOnCollisionSystem/MeshSplitterOnCollisionSystem';
import MeshSplitterSystem from '../systems/MeshSplitterSystem/MeshSplitterSystem';
import PhysicsDebrisSystem from '../systems/PhysicsDebrisSystem/PhysicsDebrisSystem';
import PhysicsSystem from '../systems/PhysicsSystem';
import RenderSystem from '../systems/RenderSystem';
import type World from '../World';

class MainScene extends GameScene {
  constructor(world: World, canvas: HTMLCanvasElement) {
    super(world, canvas);

    world.addSystem(new RenderSystem(this));
    world.addSystem(new PhysicsSystem());
    world.addSystem(new MeshSplitterSystem());
    world.addSystem(new MeshSplitterOnCollisionSystem());
    world.addSystem(new PhysicsDebrisSystem());

    createSplittableGlass(world);

    setTimeout(() => createBall(world), 1000);

    this.camera.position.set(0, 0, 5);
  }
}

export default MainScene;