import MESSAGE_TYPES from './MESSAGE_TYPES';

type MessageHandler = (payload: unknown) => void;

interface NetworkMessage {
  type: string;
  payload: unknown;
}

class NetworkManager {
  static instance = new NetworkManager();

  private socket?: WebSocket;
  private handlers = new Map<string, Set<MessageHandler>>();
  private _isConnected = false;
  private _playerId?: string;

  get isConnected() { return this._isConnected; }
  get playerId() { return this._playerId; }

  private buildWsUrl(): string {
    const port = import.meta.env.VITE_WS_PORT || '3002';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.hostname}:${port}`;
  }

  connect(url?: string) {
    if (this.socket) return;

    const wsUrl = url ?? this.buildWsUrl();
    console.log('[Network] Connecting to:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this._isConnected = true;
      console.log('[Network] Connected!');
    };

    this.socket.onclose = () => {
      this._isConnected = false;
      this.socket = undefined;
    };

    this.socket.onerror = (error) => {
      console.error('[Network] Error:', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const message: NetworkMessage = JSON.parse(event.data);
        console.log('[Network] Received:', message.type);
        this.storeNewPlayer(message);
        this.handlers.get(message.type)?.forEach(handler => handler(message.payload));
      } catch (err) {
        console.error('[Network] Failed to parse message:', err);
      }
    };
  }

  private storeNewPlayer(message: NetworkMessage) {
    if (message.type !== MESSAGE_TYPES.PLAYER_WELCOME) return;

    const payload = message.payload as { playerId: string };
    this._playerId = payload.playerId;
    console.log('[Network] Assigned player ID:', this._playerId);
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
    this._isConnected = false;
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.off(type, handler);
  }

  off(type: string, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  send(type: string, payload: unknown) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('[Network] Cannot send - not connected');
      return;
    }
    const message = JSON.stringify({ type, payload });
    this.socket.send(message);
  }
}

export { MESSAGE_TYPES };
export default NetworkManager;
