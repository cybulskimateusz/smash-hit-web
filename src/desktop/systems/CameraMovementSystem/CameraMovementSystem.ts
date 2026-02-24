import CameraRail from '@desktop/components/CameraRail';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import GameSettingsManager from '@desktop/singletons/GameSettingsManager';
import autoBind from 'auto-bind';
import gsap from 'gsap';
import { Vector3 } from 'three';

const DEFAULT_CAMERA_SPEED = 0.025;
const CAMERA_VIEW_DISTANCE = 0.5;
const ROTATION_INTERVAL = 5;
const CAMERA_SMOOTH_FACTOR = 0.05;

export default class extends System {
  private currentRail?: CameraRail;
  private nextRail?: CameraRail;

  private currentRailLength = 0;
  private currentRailDistance = 0;
  private lastTime = -1;
  private cameraSpeed = DEFAULT_CAMERA_SPEED;
  private difficulty = 0;

  private railsSinceRotation = 0;
  private rotationTimeline = gsap.timeline({ paused: true });
  private cameraTangent = new Vector3();

  init(): void {
    autoBind(this);
  }

  update(time: number): void {
    if (this.lastTime < 0) {
      this.lastTime = time;
    }
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.updateProgress(delta);
    this.scheduleRail();
    this.moveCamera();
    this.rotateCamera();

    if (this.difficulty === GameSettingsManager.instance.difficulty) return;
    this.difficulty = GameSettingsManager.instance.difficulty;
    gsap.to(this, {
      cameraSpeed: DEFAULT_CAMERA_SPEED * this.difficulty,
      duration: 3,
    });
  }

  private rotateCamera() {
    if (this.rotationTimeline.isActive()) return;

    const reduceRotationWithLevel = ROTATION_INTERVAL * this.difficulty;
    const railsToPass = ROTATION_INTERVAL + reduceRotationWithLevel;

    if (this.railsSinceRotation < railsToPass) return;
    if (!this.currentRail) return;
    
    this.railsSinceRotation = 0;

    const tangent = this.getCameraTangent().normalize();
    const startUp = this.world.camera.up.clone();
    const targetUp = startUp.clone().applyAxisAngle(tangent, Math.PI / 2);
    const progress = { value: 0 };

    this.rotationTimeline.to(progress, {
      value: 1,
      duration: 5,
      onUpdate: () => {
        this.world.camera.up.copy(startUp).lerp(targetUp, progress.value).normalize();
      },
    }).play();
  }

  private moveCamera() {
    if (!this.currentRail || !this.nextRail) return;
  
    const targetPosition = this.currentRail.rail.getPointAt(this.currentRail.progress);
    const targetTangent = this.getCameraTangent();

    if (this.cameraTangent.lengthSq() === 0) {
      this.cameraTangent.copy(targetTangent);
    }

    this.world.camera.position.lerp(targetPosition, CAMERA_SMOOTH_FACTOR);
    this.cameraTangent.lerp(targetTangent, CAMERA_SMOOTH_FACTOR);

    this.world.camera.lookAt(this.world.camera.position.clone().add(this.cameraTangent));
  }

  private getCameraTangent(): Vector3 {
    if (!this.currentRail) return new Vector3();

    const isOnCurrentRail = this.currentRail.progress + CAMERA_VIEW_DISTANCE < 1;

    if (isOnCurrentRail || !this.nextRail)
      return this.currentRail.rail.getTangentAt(this.currentRail.progress + CAMERA_VIEW_DISTANCE);

    // Makes sure the camera does not look at a wall when curves are too big.
    return this.nextRail.rail.getTangentAt(this.currentRail.progress - (1 - CAMERA_VIEW_DISTANCE));
  }

  private updateProgress(delta: number) {
    if (!this.currentRail) return;
    this.currentRailDistance += delta * this.cameraSpeed;
    const progress = Math.min(this.currentRailDistance / this.currentRailLength, 1);
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
    this.currentRailDistance = 0;

    if (!this.rotationTimeline.isActive()) this.railsSinceRotation++;
  }

  onEntityRemoved(_entity: Entity): void {}
}
