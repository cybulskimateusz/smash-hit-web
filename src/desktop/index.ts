import autoBind from 'auto-bind';

import GameView from './views/game-view/game-view';
// import QRCodeView from './views/qr-code-view/qr-code-view';

class Desktop {
  private app: HTMLElement = document.querySelector('#app')!;
  // private qrCodeView: QRCodeView;

  constructor() {
    autoBind(this);

    // this.qrCodeView = new QRCodeView({ onGameStart: this.onGameStart });
    // this.app.appendChild(this.qrCodeView.view);
    this.onGameStart();
  }

  private onGameStart() {
    // this.qrCodeView.view.remove();
    this.app.appendChild(new GameView().view);
  }
}

export default new Desktop();
