import CameraRail from '@desktop/components/CameraRail';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import ClockManager from '@desktop/singletons/ClockManager';
import GameSettingsManager from '@desktop/singletons/GameSettingsManager';
import autoBind from 'auto-bind';
import gsap from 'gsap';
import { Vector3 } from 'three';

const DEFAULT_CAMERA_SPEED = 0.025;
const CAMERA_VIEW_DISTANCE = 0.5;
const ROTATION_INTERVAL = 5;

export default class extends System {
  private currentRail?: CameraRail;
  private nextRail?: CameraRail;

  private currentRailLength = 0;
  private railStartedAt = ClockManager.instance.currentTime;
  private cameraSpeed = DEFAULT_CAMERA_SPEED;

  private railsSinceRotation = 0;

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    this.updateProgress(time);
    this.scheduleRail();
    this.rotateCamera();
    this.moveCamera();

    this.cameraSpeed = DEFAULT_CAMERA_SPEED * GameSettingsManager.instance.difficulty;
  }

  private rotateCamera() {
    const reduceRotationWithLevel = ROTATION_INTERVAL * GameSettingsManager.instance.difficulty;
    const railsToPass = ROTATION_INTERVAL + reduceRotationWithLevel;

    if (this.railsSinceRotation < railsToPass) return;
    if (!this.currentRail) return;
    
    this.railsSinceRotation = 0;

    const tangent = this.getCameraTangent().normalize();
    const startUp = this.world.camera.up.clone();
    const targetUp = startUp.clone().applyAxisAngle(tangent, Math.PI / 2);
    const progress = { value: 0 };

    gsap.to(progress, {
      value: 1,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.world.camera.up.copy(startUp).lerp(targetUp, progress.value).normalize();
      },
    });
  }

  private moveCamera() {
    if (!this.currentRail || !this.nextRail) return;
  
    const position = this.currentRail.rail.getPointAt(this.currentRail.progress);

    const tangent = this.getCameraTangent();

    this.world.camera.position.copy(position);
    this.world.camera.lookAt(position.clone().add(tangent));
  }

  private getCameraTangent(): Vector3 {
    if (!this.currentRail) return new Vector3();

    const isOnCurrentRail = this.currentRail.progress + CAMERA_VIEW_DISTANCE < 1;

    if (isOnCurrentRail || !this.nextRail)
      return this.currentRail.rail.getTangentAt(this.currentRail.progress + CAMERA_VIEW_DISTANCE);

    // Makes sure the camera does not look at a wall when curves are too big.
    return this.nextRail.rail.getTangentAt(this.currentRail.progress - (1 - CAMERA_VIEW_DISTANCE));
  }

  private updateProgress(time: number) {
    if (!this.currentRail) return;
    const elapsed = time - this.railStartedAt;
    const distance = elapsed * this.cameraSpeed;
    const progress = Math.min(distance / this.currentRailLength, 1);
    this.currentRail.progress = progress;
    if (progress >= 1) this.currentRail = undefined;
  }

  scheduleRail(): void {
    if (this.currentRail) return;
    const availableEntities = this.query(CameraRail).filter(entity => entity.get(CameraRail)!.progress < 1);

    if (!availableEntities.length) return;

    this.currentRail = availableEntities[0].get(CameraRail)!;
    this.nextRail = availableEntities[1].get(CameraRail)!;

    this.currentRailLength = this.currentRail.rail.getLength();
    this.railStartedAt = ClockManager.instance.currentTime;

    this.railsSinceRotation++;
  }

  onEntityRemoved(_entity: Entity): void {}
}
