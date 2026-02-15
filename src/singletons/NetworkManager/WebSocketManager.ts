import autoBind from 'auto-bind';

import RoomManager from './RoomManager';

class WebSocketManager {
  static instance = new WebSocketManager();

  private socket?: WebSocket;
  private _clientId?: string;

  get clientId() { return this._clientId; }

  private handlers = new Map<keyof SignalingPayloadMap, Set<MessageHandler>>();
  private pendingMessages: SignalingEvent[] = [];

  constructor() {
    autoBind(this);
    this.socket = new WebSocket(this.getWebsocketURL());

    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.socket.onmessage = this.onMessage;
  }

  public send(event: SignalingEvent) {
    if (this.socket?.readyState === WebSocket.OPEN)
      return this.socket.send(JSON.stringify(event));
   
    this.pendingMessages.push(event);
  }

  public on<T extends keyof SignalingPayloadMap>(type: T, handler: MessageHandler) {
    if (!this.handlers.has(type)) 
      this.handlers.set(type, new Set());
    
    this.handlers.get(type)!.add(handler);

    return { cancel: () => this.cancelHandler(type, handler) };
  }

  public cancelHandler(type: keyof SignalingPayloadMap, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  private onOpen() {
    this.socket?.send(JSON.stringify({
      type: 'join',
      room: RoomManager.instance.roomID,
    }));

    this.pendingMessages.forEach(event => this.send(event));
    this.pendingMessages = [];
  };

  private onClose() {
    this.socket = undefined;
  };

  private onError(error: Event) {
    console.error('[WebSocketManager] Error:', error);
  }

  private async onMessage(event: MessageEvent<string>) {
    const message: SignalingEvent = JSON.parse(event.data);

    try {
      console.log('[WebSocketManager] Received:', message.type);

      if (message.type === 'joined')
        this._clientId = (message as SignalingMessage<'joined'>).payload.clientId;

      this.handlers.get(message.type)?.forEach(callback => callback(message));
    } catch (err) {
      console.error('[WebSocketManager] Failed to parse message:', err);
    }
  }

  private getWebsocketURL(): string {
    const wsUrl = import.meta.env.VITE_WS_URL;

    if (wsUrl)
      return wsUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');

    const port = import.meta.env.VITE_WS_PORT || '3002';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.hostname}:${port}`;
  }
}

export default WebSocketManager;