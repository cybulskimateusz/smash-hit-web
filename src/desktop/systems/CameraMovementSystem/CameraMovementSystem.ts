import CameraRail from '@desktop/components/CameraRail';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import ClockManager from '@desktop/singletons/ClockManager';
import GameSettingsManager from '@desktop/singletons/GameSettingsManager';
import autoBind from 'auto-bind';
import { Vector3 } from 'three';

const DEFAULT_CAMERA_SPEED = 0.025;
const CAMERA_VIEW_DISTANCE = 0.3;

export default class extends System {
  private currentRail?: CameraRail;
  private nextRail?: CameraRail;

  private currentRailLength = 0;
  private railStartedAt = ClockManager.instance.currentTime;
  private cameraSpeed = DEFAULT_CAMERA_SPEED;

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    this.updateProgress(time);
    this.scheduleRail();
    this.moveCamera();

    this.cameraSpeed = DEFAULT_CAMERA_SPEED * GameSettingsManager.instance.difficulty;
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
  }

  onEntityRemoved(_entity: Entity): void {}
}
