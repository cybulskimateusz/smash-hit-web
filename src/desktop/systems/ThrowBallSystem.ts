import Player from '@desktop/components/Player';
import System from '@desktop/core/System';
import createBall from '@desktop/prefabs/entities/createBall';
import DesktopNetworkManager from '@desktop/singletons/NetworkManager';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import PhysicsSystem from './PhysicsSystem';

export default class extends System {
  private readonly ballSpeed = 100;
  private physicsSystem?: PhysicsSystem;

  init(): void {
    autoBind(this);
    const physicsSystem = this.world.systems.find(system => system instanceof PhysicsSystem);
    if (!physicsSystem) throw Error('ThrowBallSystem requires PhysicsSystem to be in world');
    this.physicsSystem = physicsSystem;

    DesktopNetworkManager.instance.on(MESSAGE_TYPES.BALL_THROWN, this.onBallThrown);
  }

  private onBallThrown(payload: unknown) {
    try {
      const { direction, playerId } = payload as BallThrownPayload;

      const owner = this.query(Player).find(entity => entity.get(Player)?.id === playerId);

      const screenX = Math.max(-1, Math.min(1, direction[0]));
      const screenY = Math.max(-1, Math.min(1, direction[1]));

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(screenX, screenY), this.world.camera);

      const worldDirection = raycaster.ray.direction.clone();

      const spawnOffset = worldDirection.clone().multiplyScalar(5);
      const spawnPosition = this.world.camera.position.clone().add(spawnOffset);
      const velocity = worldDirection.multiplyScalar(this.ballSpeed);

      const entity = createBall(this.world, {
        position: spawnPosition,
        owner,
        color: owner?.get(Player)?.color,
      });

      requestAnimationFrame(() => {
        this.physicsSystem?.setVelocity(entity, velocity);
      });
    } catch (err) {
      console.error('[ThrowBall] ERROR:', err);
    }
  }

  update(): void {}
  onEntityRemoved(): void {}
}
