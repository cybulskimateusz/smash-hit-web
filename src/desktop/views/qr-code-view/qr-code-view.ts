import './qr-code-view.scss';

import View from '@src/abstracts/View';
import MESSAGE_TYPES from '@src/mobile/singletons/NetworkManager/MESSAGE_TYPES';
import NetworkManager from '@src/mobile/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

import COMPONENTS from './qr-code-view.components';

interface QRCodeViewProps {
  onGameStart: () => void;
}

class QRCodeView extends View {
  protected _view = View.createElement('section', { className: 'qr-code-view' });

  private playerSquares = new Map<string, HTMLElement>();
  private connectedPlayerId: string | null = null;

  constructor(props: QRCodeViewProps) {
    super();
    autoBind(this);

    this._view.appendChild(COMPONENTS.QR_CODE);
    this._view.appendChild(COMPONENTS.HEADING);
    this._view.appendChild(COMPONENTS.CONNECTED_PLAYERS_LIST);
    this._view.appendChild(COMPONENTS.START_GAME_BUTTON);
    COMPONENTS.START_GAME_BUTTON.onclick = props.onGameStart;

    NetworkManager.instance.on(MESSAGE_TYPES.PLAYER_JOINED, this.onPlayerJoined);
    NetworkManager.instance.on(MESSAGE_TYPES.PLAYER_LEFT, this.onPlayerLeft);
    NetworkManager.instance.onClose(this.onDisconnect);

    this.handleButtonActive();
  }

  private onPlayerJoined(payload: unknown) {
    const { playerId, color } = payload as { playerId: string; color: string };

    const square = View.createElement('li', { className: 'qr-code-view__player-square' });
    square.style.backgroundColor = color;

    this.connectedPlayerId = playerId;
    this.playerSquares.set(playerId, square);
    COMPONENTS.CONNECTED_PLAYERS_LIST.appendChild(square);

    this.handleButtonActive();
  };

  private onPlayerLeft(payload: unknown) {
    const { playerId } = payload as { playerId: string };

    const square = this.playerSquares.get(playerId);
    if (!square) return;

    square.remove();
    this.playerSquares.delete(playerId);

    this.handleButtonActive();
  };

  private onDisconnect() {
    if (!this.connectedPlayerId) return;

    const square = this.playerSquares.get(this.connectedPlayerId);
    if (square) square.remove();

    this.playerSquares.delete(this.connectedPlayerId);
    this.connectedPlayerId = null;

    this.handleButtonActive();
  };

  private handleButtonActive() {
    if (!this.playerSquares.size) COMPONENTS.START_GAME_BUTTON.disabled = true;
    else COMPONENTS.START_GAME_BUTTON.disabled = false;
  }
}

export default QRCodeView;