import CameraRail from '@src/components/CameraRail';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import ClockManager from '@src/managers/ClockManager';
import autoBind from 'auto-bind';

const CAMERA_SPEED = 0.02;

export default class extends System {
  private currentRail?: CameraRail;
  private currentRailLength = 0;
  private railStartedAt = ClockManager.instance.currentTime;

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    this.updateProgress(time);
    this.scheduleRail();
    this.moveCamera();
  }

  private moveCamera() {
    if (!this.currentRail) return;
    const { progress, rail } = this.currentRail;
    const position = rail.getPointAt(progress);
    const tangent = rail.getTangentAt(progress);

    this.world.camera.position.copy(position);
    this.world.camera.lookAt(position.clone().add(tangent));
  }

  private updateProgress(time: number) {
    if (!this.currentRail) return;
    const elapsed = time - this.railStartedAt;
    const distance = elapsed * CAMERA_SPEED;
    const progress = Math.min(distance / this.currentRailLength, 1);
    this.currentRail.progress = progress;
    if (progress >= 1) this.currentRail = undefined;
  }

  scheduleRail(): void {
    if (this.currentRail) return;
    const availableEntities = this.query(CameraRail).filter(entity => entity.get(CameraRail)!.progress < 1);

    if (!availableEntities.length) return;

    this.currentRail = availableEntities[0].get(CameraRail)!;
    this.currentRailLength = this.currentRail.rail.getLength();
    this.railStartedAt = ClockManager.instance.currentTime;
  }

  onEntityRemoved(_entity: Entity): void {}
}
