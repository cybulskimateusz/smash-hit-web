import Player from '@desktop/components/Player';
import System from '@desktop/core/System';
import createBall from '@desktop/prefabs/entities/createBall';
import DesktopNetworkManager from '@desktop/singletons/NetworkManager';
import MESSAGE_TYPES from '@src/singletons/NetworkManager/MESSAGE_TYPES';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import GameSettingsManager from '../singletons/GameSettingsManager';
import PhysicsSystem from './PhysicsSystem';

const IS_DEV = process.env.NODE_ENV !== 'production';

const DEBUG_PLAYER = new Player();
DEBUG_PLAYER.id = 'debug-player';
DEBUG_PLAYER.color = new THREE.Color(0xff0000);

export default class extends System {
  private readonly ballSpeed = 100;
  private physicsSystem?: PhysicsSystem;

  init(): void {
    autoBind(this);
    const physicsSystem = this.world.systems.find(system => system instanceof PhysicsSystem);
    if (!physicsSystem) throw Error('ThrowBallSystem requires PhysicsSystem to be in world');
    this.physicsSystem = physicsSystem;

    if (IS_DEV) this.runDebug();
    DesktopNetworkManager.instance.on(MESSAGE_TYPES.BALL_THROWN, this.onBallThrown);
  }

  private onBallThrown(payload: BallThrownPayload) {
    try {
      const { direction, playerId } = payload;

      const owner = this.query(Player).find(entity => entity.get(Player)?.id === playerId);

      const screenX = Math.max(-1, Math.min(1, direction[0]));
      const screenY = Math.max(-1, Math.min(1, direction[1]));

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(screenX, screenY), this.world.camera);

      const worldDirection = raycaster.ray.direction.clone();

      const spawnOffset = worldDirection.clone().multiplyScalar(5);
      const spawnPosition = this.world.camera.position.clone().add(spawnOffset);
      const velocity = worldDirection.multiplyScalar(this.ballSpeed * GameSettingsManager.instance.difficulty);

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

  private runDebug() {
    this.world.createEntity().add(DEBUG_PLAYER);
    document.addEventListener('click', this.onDevClick);
  }

  private onDevClick(event: MouseEvent) {
    const direction: [number, number, number] = [
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      -1,
    ];

    this.onBallThrown({
      direction,
      playerId: DEBUG_PLAYER.id,
    });
  }

  update(): void {}
  onEntityRemoved(): void {}
}
