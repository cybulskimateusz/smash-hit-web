import autoBind from 'auto-bind';

import MESSAGE_TYPES from './MESSAGE_TYPES';
import RoomManager from './RoomManager';
import WebSocketManager from './WebSocketManager';

type GameMessageHandler = (payload: unknown) => void;

class NetworkManager {
  static instance = new NetworkManager();

  static playerID = crypto.randomUUID();
  static connectedPlayers: PlayerJoinedPayload[] = [];

  private peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  private dataChannel?: RTCDataChannel;
  private gameHandlers = new Map<string, Set<GameMessageHandler>>();
  private openHandlers = new Set<() => void>();
  private closeHandlers = new Set<() => void>();

  get isConnected() {
    return this.dataChannel?.readyState === 'open';
  }

  get qrCodeCanvas() {
    return RoomManager.instance.qrCodeCanvas;
  }

  constructor() {
    autoBind(this);

    this.peerConnection.onicecandidate = this.onIceCandidate;
    this.peerConnection.ondatachannel = this.onDataChannel;

    this.listenToSignaling();

    if (!RoomManager.instance.isHost) {
      this.setupDataChannel(this.peerConnection.createDataChannel('game'));
      this.createOffer();
    }

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

  public send(type: string, payload: unknown) {
    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({ type, payload }));
    }
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

  private listenToSignaling() {
    WebSocketManager.instance.on('offer', this.onOffer);
    WebSocketManager.instance.on('answer', this.onAnswer);
    WebSocketManager.instance.on('candidate', this.onCandidate);
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (!event.candidate) return;

    WebSocketManager.instance.send({
      type: 'candidate',
      payload: event.candidate
    });
  }

  private onDataChannel(event: RTCDataChannelEvent) {
    this.setupDataChannel(event.channel);
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;

    this.dataChannel.onopen = () => {
      console.log('[NetworkManager] Data channel open');
      this.openHandlers.forEach(handler => handler());
    };

    this.dataChannel.onclose = () => {
      console.log('[NetworkManager] Data channel closed');
      this.closeHandlers.forEach(handler => handler());
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        this.gameHandlers.get(type)?.forEach(handler => handler(payload));
      } catch (err) {
        console.error('[NetworkManager] Failed to parse message:', err);
      }
    };
  }

  private async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    WebSocketManager.instance.send({ type: 'offer', payload: offer });
  }

  private async onOffer(event: SignalingEvent) {
    const message = event as SignalingMessage<'offer'>;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    WebSocketManager.instance.send({ type: 'answer', payload: answer });
  }

  private async onAnswer(event: SignalingEvent) {
    const message = event as SignalingMessage<'answer'>;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
  }

  private async onCandidate(event: SignalingEvent) {
    const message = event as SignalingMessage<'candidate'>;
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.payload));
  }
}

export default NetworkManager;
