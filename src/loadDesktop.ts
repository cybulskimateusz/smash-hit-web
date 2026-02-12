import WebRTCManager from './singletons/NetworkManager/NetworkManager';
import RoomManager from './singletons/NetworkManager/RoomManager';

const showQRCode = () => {
  const appCanvas = document.querySelector('#app') as HTMLCanvasElement;
  appCanvas.style.display = 'none';

  const overlay = document.createElement('div');
  overlay.id = 'qr-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #242424;
    z-index: 100;
  `;

  const qrCanvas = RoomManager.instance.qrCodeCanvas;
  qrCanvas.style.cssText = 'border-radius: 12px;';

  const label = document.createElement('p');
  label.textContent = 'Scan to join';
  label.style.cssText = 'margin-top: 16px; font-size: 18px; color: rgba(255,255,255,0.6);';

  overlay.appendChild(qrCanvas);
  overlay.appendChild(label);
  document.body.appendChild(overlay);

  return overlay;
};

const startGame = async (overlay: HTMLElement) => {
  overlay.remove();

  const appCanvas = document.querySelector('#app') as HTMLCanvasElement;
  appCanvas.style.display = '';

  const { default: Game } = await import('./Game');
  const { default: AssetManager } = await import('./singletons/AssetManager/AssetManager');
  const { default: MainScene } = await import('./scenes/MainScene');

  await AssetManager.instance.preload();
  new Game(appCanvas, MainScene);
};

const loadDesktop = async () => {
  const overlay = showQRCode();

  WebRTCManager.instance.onOpen(() => {
    startGame(overlay);
  });
};

export default loadDesktop;
