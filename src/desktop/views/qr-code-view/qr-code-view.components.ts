import View from '@src/abstracts/View';
import COPY from '@src/COPY';
import NetworkManager from '@src/mobile/singletons/NetworkManager/NetworkManager';

const QR_CODE = NetworkManager.instance.qrCodeCanvas;
QR_CODE.className = 'qr-code-view__qr-code';

export default {
  HEADING: View.createElement('h1', {
    className: 'qr-code-view__heading',
    textContent: COPY.INSTRUCTION_SCAN_QR,
  }),
  QR_CODE,
  CONNECTED_PLAYERS_LIST: View.createElement('ul', {
    className: 'qr-code-view__players'
  }),
  START_GAME_BUTTON: View.createElement('button', {
    className: 'base-button',
    textContent: COPY.BUTTON_START_GAME,
  })
};