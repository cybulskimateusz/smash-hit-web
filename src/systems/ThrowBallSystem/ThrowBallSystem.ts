import System from '@src/core/System';
import * as PREFABS from '@src/prefabs';
import autoBind from 'auto-bind';
import * as THREE from 'three';

import type PhysicsSystem from '../PhysicsSystem';

export default class extends System {
  constructor(
    private camera: THREE.Camera,
    private physicsSystem: PhysicsSystem
  ) {
    super();
    autoBind(this);
  }

  init(): void {
    this.addEventListeners();
  }

  private shootBall(event: MouseEvent) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    const entity = PREFABS.createBall(this.world, {
      position: new THREE.Vector3(mouse.x, mouse.y, this.camera.position.z)
    });

    requestAnimationFrame(() => {
      const direction = raycaster.ray.direction.clone().multiplyScalar(20);
      this.physicsSystem.setVelocity(entity, direction);
    });
  }

  private addEventListeners() {
    window.addEventListener('click', this.shootBall);
  }

  update(): void {}
  onEntityRemoved(): void {}
}