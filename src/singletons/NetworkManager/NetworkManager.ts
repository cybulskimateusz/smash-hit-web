import autoBind from 'auto-bind';

import MESSAGE_TYPES from './MESSAGE_TYPES';
import RoomManager from './RoomManager';
import WebSocketManager from './WebSocketManager';

type GameMessageHandler = (payload: unknown) => void;

interface PeerEntry {
  peerConnection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

class NetworkManager {
  static instance = new NetworkManager();

  static get playerID() { return WebSocketManager.instance.clientId; }
  static connectedPlayers: PlayerJoinedPayload[] = [];

  // Host: multiple peers keyed by remote clientId
  private peers = new Map<string, PeerEntry>();

  // Mobile: single peer connection to the host
  private peerConnection?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private hostSenderId?: string;

  private gameHandlers = new Map<string, Set<GameMessageHandler>>();
  private openHandlers = new Set<() => void>();
  private closeHandlers = new Set<() => void>();

  private readonly isHost = RoomManager.instance.isHost;

  get isConnected() {
    if (!this.isHost) return this.dataChannel?.readyState === 'open';

    for (const peer of this.peers.values()) 
      return peer.dataChannel?.readyState === 'open';
    
    return false;
  }

  get qrCodeCanvas() {
    return RoomManager.instance.qrCodeCanvas;
  }

  constructor() {
    autoBind(this);

    this.listenToSignaling();

    if (!this.isHost) {
      this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
      this.peerConnection.onicecandidate = this.onMobileIceCandidate;
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
    const message = JSON.stringify({ type, payload });

    if (this.isHost) {
      for (const peer of this.peers.values()) {
        if (peer.dataChannel?.readyState === 'open') {
          peer.dataChannel.send(message);
        }
      }
    } else {
      if (this.dataChannel?.readyState === 'open') {
        this.dataChannel.send(message);
      }
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

  // --- Host: per-peer connection management ---

  private getOrCreatePeer(remoteSenderId: string): PeerEntry {
    let entry = this.peers.get(remoteSenderId);
    if (entry) return entry;

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;
      WebSocketManager.instance.send({
        type: 'candidate',
        payload: event.candidate,
        targetId: remoteSenderId,
      });
    };

    peerConnection.ondatachannel = (event) => {
      const peer = this.peers.get(remoteSenderId);
      if (peer) {
        peer.dataChannel = event.channel;
        this.setupHostDataChannel(event.channel, remoteSenderId);
      }
    };

    entry = { peerConnection };
    this.peers.set(remoteSenderId, entry);
    return entry;
  }

  private setupHostDataChannel(channel: RTCDataChannel, remoteSenderId: string) {
    channel.onopen = () => {
      console.log(`[NetworkManager] Data channel open (peer: ${remoteSenderId})`);
      this.openHandlers.forEach(handler => handler());
    };

    channel.onclose = () => {
      console.log(`[NetworkManager] Data channel closed (peer: ${remoteSenderId})`);
      this.peers.delete(remoteSenderId);
      this.closeHandlers.forEach(handler => handler());
    };

    channel.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        this.gameHandlers.get(type)?.forEach(handler => handler(payload));
      } catch (err) {
        console.error('[NetworkManager] Failed to parse message:', err);
      }
    };
  }

  // --- Mobile: single connection management ---

  private onMobileIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (!event.candidate) return;

    WebSocketManager.instance.send({
      type: 'candidate',
      payload: event.candidate
    });
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

  // --- Signaling handlers ---

  private async createOffer() {
    if (!this.peerConnection) return;
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    WebSocketManager.instance.send({ type: 'offer', payload: offer });
  }

  private async onOffer(event: SignalingEvent) {
    if (!this.isHost) return;

    const message = event as SignalingMessage<'offer'>;
    const senderId = message.senderId;
    if (!senderId) return;

    const peer = this.getOrCreatePeer(senderId);
    await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
    const answer = await peer.peerConnection.createAnswer();
    await peer.peerConnection.setLocalDescription(answer);
    WebSocketManager.instance.send({ type: 'answer', payload: answer, targetId: senderId });
  }

  private async onAnswer(event: SignalingEvent) {
    if (this.isHost) return;

    const message = event as SignalingMessage<'answer'>;

    // Ignore answers not targeted at us
    const myId = WebSocketManager.instance.clientId;
    if (message.targetId && myId && message.targetId !== myId) return;

    // Store the host's senderId so we can filter candidates
    if (!this.hostSenderId) this.hostSenderId = message.senderId;

    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload));
  }

  private async onCandidate(event: SignalingEvent) {
    const message = event as SignalingMessage<'candidate'>;

    if (this.isHost) {
      const senderId = message.senderId;
      if (!senderId) return;
      const peer = this.peers.get(senderId);
      if (!peer) return;
      await peer.peerConnection.addIceCandidate(new RTCIceCandidate(message.payload));
    } else {
      // Mobile: only accept candidates targeted at us or from the host
      const myId = WebSocketManager.instance.clientId;
      if (message.targetId && myId && message.targetId !== myId) return;
      if (this.hostSenderId && message.senderId !== this.hostSenderId) return;
      if (!this.peerConnection) return;
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.payload));
    }
  }
}

export default NetworkManager;
