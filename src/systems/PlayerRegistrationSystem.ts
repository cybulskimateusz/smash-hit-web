import NetworkIdentity from '@src/components/NetworkIdentity';
import Player from '@src/components/Player';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import WebRTCManager from '@src/singletons/NetworkManager/NetworkManager';
import autoBind from 'auto-bind';

export default class PlayerRegistrationSystem extends System {
  private pendingPlayers: PlayerJoinedPayload[] = [];

  init() {
    autoBind(this);
    WebRTCManager.instance.on(MESSAGE_TYPES.PLAYER_JOINED, this.onPlayerJoined);
  }

  private onPlayerJoined(payload: unknown) {
    this.pendingPlayers.push(payload as PlayerJoinedPayload);
  }

  update() {
    this.pendingPlayers.forEach(data => {
      const entity = this.world.createEntity();

      const player = new Player();
      player.id = data.playerId;
      player.color = data.color;

      const networkIdentity = new NetworkIdentity();
      networkIdentity.networkId = data.playerId;
      networkIdentity.isLocal = data.isLocal;

      entity.add(player).add(networkIdentity);
    });

    this.pendingPlayers = [];
  }

  onEntityRemoved(_entity: Entity): void {}
}
