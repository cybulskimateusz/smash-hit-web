import crosshairSvg from '@desktop/assets/svg/chrosshair.svg?raw';
import System from '@desktop/core/System';
import MESSAGE_TYPES from '@src/mobile/singletons/NetworkManager/MESSAGE_TYPES';
import WebRTCManager from '@src/mobile/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

interface AimPayload {
  position: [number, number];
  playerId: string;
}

export default class CrosshairSystem extends System {
  private crosshair?: HTMLDivElement;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private isVisible = false;

  init(): void {
    autoBind(this);
    this.createCrosshair();
    WebRTCManager.instance.on(MESSAGE_TYPES.AIM_UPDATE, this.onAimUpdate);
  }

  private createCrosshair() {
    this.crosshair = document.createElement('div');
    this.crosshair.id = 'remote-crosshair';
    this.crosshair.style.cssText = `
      position: fixed;
      width: 50px;
      height: 50px;
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -50%);
      opacity: 1;
      transition: opacity 0.2s;
      color: rgba(0, 255, 100, 0.9);
      filter: drop-shadow(0 0 15px rgba(0, 255, 100, 0.5));
    `;
    this.crosshair.innerHTML = crosshairSvg;
    document.body.appendChild(this.crosshair);

    this.currentX = window.innerWidth / 2;
    this.currentY = window.innerHeight / 2;
    this.targetX = this.currentX;
    this.targetY = this.currentY;
  }

  private onAimUpdate(payload: unknown) {
    const { position } = payload as AimPayload;

    // Convert from -1..1 to screen coordinates
    this.targetX = ((position[0] + 1) / 2) * window.innerWidth;
    this.targetY = ((-position[1] + 1) / 2) * window.innerHeight;

    if (!this.isVisible && this.crosshair) {
      this.isVisible = true;
      this.crosshair.classList.add('visible');
    }
  }

  update(): void {
    if (!this.crosshair || !this.isVisible) return;

    // Smooth interpolation
    const smoothing = 0.15;
    this.currentX += (this.targetX - this.currentX) * smoothing;
    this.currentY += (this.targetY - this.currentY) * smoothing;

    this.crosshair.style.left = `${this.currentX}px`;
    this.crosshair.style.top = `${this.currentY}px`;
  }

  onEntityRemoved(): void {}
}
