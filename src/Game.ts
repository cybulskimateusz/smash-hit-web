import autoBind from 'auto-bind';

import GameScene from './components/GameScene';
import RenderingManager from './managers/RenderingManager';
import World from './World';

declare global {
  interface Window {
    game: Game;
  }
}

class Game {
  public renderer: RenderingManager;
  public world: World = new World();
  public scene: GameScene;
  
  constructor(
    canvas: HTMLCanvasElement,
    scene: new (world: World, canvas: HTMLCanvasElement) => GameScene
  ) {
    autoBind(this);

    this.scene = new scene(this.world, canvas);
    this.renderer = new RenderingManager({
      canvas: canvas,
      onUpdate: this.onUpdate,
    });
    this.renderer.scene = this.scene;
    window.game = this;
  }

  private onUpdate() {
    this.world.update();
  }
}

export default Game;