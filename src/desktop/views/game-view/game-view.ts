import './game-view.scss';

import SVG_CROSSHAIR from '@desktop/assets/svg/chrosshair.svg?raw';
import MainScene from '@desktop/scenes/MainScene';
import AssetManager from '@desktop/singletons/AssetManager/AssetManager';
import DesktopNetworkManager from '@desktop/singletons/NetworkManager';
import View from '@src/abstracts/View';
import Loader from '@src/shared-components/loader/loader';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import autoBind from 'auto-bind';

export default class extends View {
  protected _view = View.createElement('section', {
    className: 'game-view'
  });

  private canvas = View.createElement('canvas', {
    className: 'game-view__canvas'
  });

  private crosshairs = new Map<string, HTMLElement>();

  private loader = new Loader();

  constructor() {
    super();
    autoBind(this);

    this._view.appendChild(this.loader.view);
    this.loadGame();
    this.createCrosshairs();
    DesktopNetworkManager.instance.on(MESSAGE_TYPES.AIM_UPDATE, this.onAimUpdate);
  }

  private async loadGame() {
    this._view.appendChild(this.canvas);
    await AssetManager.instance.preload();
    const { default: Game } = await import('@desktop/Game');
    new Game(this.canvas, MainScene);
    this.loader.view.remove();
  }

  private createCrosshairs() {
    DesktopNetworkManager.connectedPlayers.forEach(player => {
      const element = View.createElement('div', {
        className: 'game-view__crosshair',
        innerHTML: SVG_CROSSHAIR,
      });
      element.style.color = `${player.color}`;

      this.crosshairs.set(player.playerId, element);
      this._view.appendChild(element);
    });
  }

  private onAimUpdate({ position, playerId }: AimPayload) {
  
    const crosshair = this.crosshairs.get(playerId);
    if (!crosshair) return;
  
    // Convert from -1..1 to screen coordinates
    const targetX = ((position[0] + 1) / 2) * window.innerWidth;
    const targetY = ((-position[1] + 1) / 2) * window.innerHeight;
  
    crosshair.style.left = `${targetX}px`;
    crosshair.style.top = `${targetY}px`;
  }
}