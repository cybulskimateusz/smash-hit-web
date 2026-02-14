import NetworkIdentity from '@desktop/components/NetworkIdentity';
import Player from '@desktop/components/Player';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import WebRTCManager from '@src/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

export default class PlayerRegistrationSystem extends System {
  private pendingPlayers: PlayerJoinedPayload[] = [];

  init() {
    autoBind(this);

    WebRTCManager.connectedPlayers.forEach(this.createPlayer);
    WebRTCManager.instance.on(MESSAGE_TYPES.PLAYER_JOINED, this.onPlayerJoined);
  }

  private onPlayerJoined(payload: unknown) {
    this.pendingPlayers.push(payload as PlayerJoinedPayload);
  }

  private createPlayer(data: PlayerJoinedPayload) {
    const entity = this.world.createEntity();

    const player = new Player();
    player.id = data.playerId;
    player.color = data.color;

    const networkIdentity = new NetworkIdentity();
    networkIdentity.networkId = data.playerId;
    networkIdentity.isLocal = data.isLocal;

    entity.add(player).add(networkIdentity);
  }

  update() {
    this.pendingPlayers.forEach(data => this.createPlayer(data));
    this.pendingPlayers = [];
  }

  onEntityRemoved(_entity: Entity): void {}
}
