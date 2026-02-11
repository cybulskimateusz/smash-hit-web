import System from '@src/core/System';
import NetworkManager, { MESSAGE_TYPES } from '@src/singletons/NetworkManager/NetworkManager';
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
    NetworkManager.instance.on(MESSAGE_TYPES.AIM_UPDATE, this.onAimUpdate);
  }

  private createCrosshair() {
    this.crosshair = document.createElement('div');
    this.crosshair.id = 'remote-crosshair';
    this.crosshair.innerHTML = `
      <style>
        #remote-crosshair {
          position: fixed;
          width: 50px;
          height: 50px;
          pointer-events: none;
          z-index: 1000;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        #remote-crosshair.visible {
          opacity: 1;
        }
        #remote-crosshair .ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(0, 255, 100, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(0, 255, 100, 0.5);
        }
        #remote-crosshair .cross {
          position: absolute;
          background: rgba(0, 255, 100, 0.9);
        }
        #remote-crosshair .cross.h {
          width: 16px;
          height: 2px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        #remote-crosshair .cross.v {
          width: 2px;
          height: 16px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        #remote-crosshair .dot {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      </style>
      <div class="ring"></div>
      <div class="cross h"></div>
      <div class="cross v"></div>
      <div class="dot"></div>
    `;
    document.body.appendChild(this.crosshair);

    // Initialize position at center
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
