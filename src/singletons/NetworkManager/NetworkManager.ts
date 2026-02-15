import autoBind from 'auto-bind';

import MESSAGE_TYPES from './MESSAGE_TYPES';
import WebSocketManager from './WebSocketManager';

type GameMessageHandler = (payload: unknown) => void;

export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

abstract class NetworkManager {
  static get playerID() { return WebSocketManager.instance.clientId; }
  static connectedPlayers: PlayerJoinedPayload[] = [];

  protected gameHandlers = new Map<string, Set<GameMessageHandler>>();
  protected openHandlers = new Set<() => void>();
  protected closeHandlers = new Set<() => void>();

  abstract get isConnected(): boolean;
  abstract send(type: string, payload: unknown): void;

  constructor() {
    autoBind(this);

    WebSocketManager.instance.on('offer', this.onOffer);
    WebSocketManager.instance.on('answer', this.onAnswer);
    WebSocketManager.instance.on('candidate', this.onCandidate);

    this.on(
      MESSAGE_TYPES.PLAYER_JOINED,
      payload => NetworkManager.connectedPlayers.push(payload as PlayerJoinedPayload)
    );
    this.on(
      MESSAGE_TYPES.PLAYER_LEFT,
      payload =>
        NetworkManager.connectedPlayers = NetworkManager.connectedPlayers.filter(connectedPlayer =>
          connectedPlayer.playerId !== (payload as PlayerLeftPayload).playerId
        )
    );
  }

  public on(type: string, handler: GameMessageHandler) {
    if (!this.gameHandlers.has(type))
      this.gameHandlers.set(type, new Set());

    this.gameHandlers.get(type)!.add(handler);

    return { cancel: () => this.gameHandlers.get(type)?.delete(handler) };
  }

  public onOpen(handler: () => void) {
    this.openHandlers.add(handler);

    if (this.isConnected) handler();

    return { cancel: () => this.openHandlers.delete(handler) };
  }

  public onClose(handler: () => void) {
    this.closeHandlers.add(handler);

    return { cancel: () => this.closeHandlers.delete(handler) };
  }

  protected dispatchMessage(event: MessageEvent) {
    try {
      const { type, payload } = JSON.parse(event.data);
      this.gameHandlers.get(type)?.forEach(handler => handler(payload));
    } catch (err) {
      console.error('[NetworkManager] Failed to parse message:', err);
    }
  }

  protected notifyOpen() {
    this.openHandlers.forEach(handler => handler());
  }

  protected notifyClose() {
    this.closeHandlers.forEach(handler => handler());
  }

  protected async onOffer(_event: SignalingEvent) {}
  protected async onAnswer(_event: SignalingEvent) {}
  protected async onCandidate(_event: SignalingEvent) {}
}

export default NetworkManager;
