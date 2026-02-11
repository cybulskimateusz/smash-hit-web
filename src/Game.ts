import GameScene from '@src/components/GameScene';
import World from '@src/core/World';
import RenderingManager from '@src/singletons/RenderingManager';
import autoBind from 'auto-bind';

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
    this.renderer = RenderingManager.init({
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