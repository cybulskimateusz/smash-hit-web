// import crosshairSvg from '@desktop/assets/svg/chrosshair.svg?raw';
import System from '@desktop/core/System';
// import View from '@src/abstracts/View';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import WebRTCManager from '@src/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

import { getCrosshair } from '../views/game-view/game-view';

interface AimPayload {
  position: [number, number];
  playerId: string;
}

export default class CrosshairSystem extends System {
  // private targetX = 0;
  // private targetY = 0;
  // private currentX = 0;
  // private currentY = 0;
  // private isVisible = false;

  init(): void {
    autoBind(this);
    WebRTCManager.instance.on(MESSAGE_TYPES.AIM_UPDATE, this.onAimUpdate);
  }

  private onAimUpdate(payload: unknown) {
    const { position, playerId } = payload as AimPayload;

    const crosshair = getCrosshair(playerId);
    if (!crosshair) return;

    // Convert from -1..1 to screen coordinates
    const targetX = ((position[0] + 1) / 2) * window.innerWidth;
    const targetY = ((-position[1] + 1) / 2) * window.innerHeight;

    crosshair.style.left = `${targetX}px`;
    crosshair.style.top = `${targetY}px`;
  }

  update(): void {
    // if (!this.crosshair || !this.isVisible) return;

    // // Smooth interpolation
    // const smoothing = 0.15;
    // this.currentX += (this.targetX - this.currentX) * smoothing;
    // this.currentY += (this.targetY - this.currentY) * smoothing;

    // this.crosshair.style.left = `${this.currentX}px`;
    // this.crosshair.style.top = `${this.currentY}px`;
  }

  onEntityRemoved(): void {}
}
