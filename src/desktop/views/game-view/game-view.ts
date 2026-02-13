import './game-view.scss';

import SVG_CROSSHAIR from '@desktop/assets/svg/chrosshair.svg?raw';
import View from '@src/abstracts/View';
import MainScene from '@src/desktop/scenes/MainScene';
import AssetManager from '@src/desktop/singletons/AssetManager/AssetManager';
import NetworkManager from '@src/singletons/NetworkManager/NetworkManager';

const CROSSHAIR_ID_PREFIX = 'crosshair_';
export const getCrosshair = (playerId: string) => document.getElementById(`${CROSSHAIR_ID_PREFIX}${playerId}`);

export default class extends View {
  protected _view = View.createElement('section', {
    className: 'game-view'
  });

  private canvas = View.createElement('canvas', {
    className: 'game-view__canvas'
  });
    
  constructor() {
    super();

    this.loadGame();
    this.createCrosshairs();
  }

  private async loadGame() {
    this._view.appendChild(this.canvas);
    await AssetManager.instance.preload();
    const { default: Game } = await import('@desktop/Game');
    new Game(this.canvas, MainScene);
  }

  private createCrosshairs() {
    NetworkManager.connectedPlayers.forEach(player => {
      const element = View.createElement('div', {
        className: 'game-view__crosshair',
        id: `${CROSSHAIR_ID_PREFIX}${player.playerId}`,
        innerHTML: SVG_CROSSHAIR,
      });
      element.style.color = `${player.color}`;
      this._view.appendChild(element);
    });
  }
}