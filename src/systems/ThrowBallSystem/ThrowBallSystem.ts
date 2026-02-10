import System from '@src/core/System';
import createBall from '@src/prefabs/createBall';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import PhysicsSystem from '../PhysicsSystem';

export default class extends System {
  private readonly ballSpeed = 300;
  private physicsSystem?: PhysicsSystem;

  init(): void {
    autoBind(this);
    this.addEventListeners();

    const physicsSystem = this.world.systems.find(system => system instanceof PhysicsSystem);
    if (!physicsSystem) throw Error('ThrowBallSystem requires PhysicsSystem to be in world');
    this.physicsSystem = physicsSystem;
  }

  private shootBall(event: MouseEvent) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.world.camera);

    const spawnOffset = raycaster.ray.direction.clone().multiplyScalar(5);
    const spawnPosition = this.world.camera.position.clone().add(spawnOffset);

    const entity = createBall(this.world, {
      position: spawnPosition
    });

    requestAnimationFrame(() => {
      const throwVelocity = raycaster.ray.direction.clone().multiplyScalar(this.ballSpeed);

      const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.world.camera.quaternion);
      const cameraVelocity = cameraForward;

      const totalVelocity = throwVelocity.add(cameraVelocity);
      this.physicsSystem?.setVelocity(entity, totalVelocity);
    });
  }

  private addEventListeners() {
    window.addEventListener('click', this.shootBall);
  }

  update(): void {}
  onEntityRemoved(): void {}
}
