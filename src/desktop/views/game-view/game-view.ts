import './game-view.scss';

import View from '@src/abstracts/View';
import MainScene from '@src/desktop/scenes/MainScene';
import AssetManager from '@src/desktop/singletons/AssetManager/AssetManager';

export default class extends View {
  protected _view = View.createElement('canvas', {
    className: 'game-view'
  });
    
  constructor() {
    super();

    this.loadGame();
  }

  private async loadGame() {
    await AssetManager.instance.preload();
    const { default: Game } = await import('@desktop/Game');
    new Game(this._view, MainScene);
  }
}