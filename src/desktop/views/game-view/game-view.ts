import './game-view.scss';

import SVG_CROSSHAIR from '@desktop/assets/svg/chrosshair.svg?raw';
import View from '@src/abstracts/View';
import MainScene from '@src/desktop/scenes/MainScene';
import AssetManager from '@src/desktop/singletons/AssetManager/AssetManager';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import NetworkManager from '@src/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

interface AimPayload {
  position: [number, number];
  playerId: string;
}

export default class extends View {
  protected _view = View.createElement('section', {
    className: 'game-view'
  });

  private canvas = View.createElement('canvas', {
    className: 'game-view__canvas'
  });

  private crosshairs = new Map<string, HTMLElement>();
    
  constructor() {
    super();
    autoBind(this);

    this.loadGame();
    this.createCrosshairs();
    NetworkManager.instance.on(MESSAGE_TYPES.AIM_UPDATE, this.onAimUpdate);
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
        innerHTML: SVG_CROSSHAIR,
      });
      element.style.color = `${player.color}`;

      this.crosshairs.set(player.playerId, element);
      this._view.appendChild(element);
    });
  }

  private onAimUpdate(payload: unknown) {
    const { position, playerId } = payload as AimPayload;
  
    const crosshair = this.crosshairs.get(playerId);
    if (!crosshair) return;
  
    // Convert from -1..1 to screen coordinates
    const targetX = ((position[0] + 1) / 2) * window.innerWidth;
    const targetY = ((-position[1] + 1) / 2) * window.innerHeight;
  
    crosshair.style.left = `${targetX}px`;
    crosshair.style.top = `${targetY}px`;
  }
}