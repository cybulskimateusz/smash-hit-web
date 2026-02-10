import NetworkIdentity from '@src/components/NetworkIdentity';
import Player from '@src/components/Player';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import NetworkManager, { MESSAGE_TYPES } from '@src/managers/NetworkManager/NetworkManager';
import type { PlayerJoinedPayload } from '@src/managers/NetworkManager/types';
import autoBind from 'auto-bind';

export default class PlayerRegistrationSystem extends System {
  private pendingPlayers: PlayerJoinedPayload[] = [];

  init() {
    autoBind(this);
    NetworkManager.instance.connect();
    NetworkManager.instance.on(MESSAGE_TYPES.PLAYER_JOINED, this.onPlayerJoined);
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
