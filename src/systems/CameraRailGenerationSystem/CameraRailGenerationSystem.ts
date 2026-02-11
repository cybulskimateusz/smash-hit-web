import CameraRail from '@src/components/CameraRail';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import getCurve from '@src/utils/three/getCurve/getCurve';
import autoBind from 'auto-bind';
import * as THREE from 'three';

const MAX_TURN_THRESHOLD = 0.5;

export const CAMERA_RAIL_SETTINGS = {
  startPoint: new THREE.Vector3(),
  startTangent: new THREE.Vector3(0, 0, -1).normalize(),
  turnStrength: 0.1,
  turnDirection: new THREE.Vector3(Math.random() - 0.5, 0, 0).normalize(),
  length: 100
};

export default class extends System {
  private allowedRailsAmount = 10;

  private curveProperties = CAMERA_RAIL_SETTINGS;
  private rails: CameraRail[] = [];
  private recentTurnStrengths: number[] = [];

  init(): void {
    autoBind(this);
    Array.from({ length: this.allowedRailsAmount }, () => this.createRail());
  }

  update(_time: number): void {
    autoBind(this);

    const availableRails = this.query(CameraRail);
    if (!availableRails.length) return;

    availableRails.forEach(this.destroyIfFinished);

    if (this.rails.length >= this.allowedRailsAmount) return;
    this.createRail();
  }

  private destroyIfFinished(entity: Entity) {
    const rail = entity.get(CameraRail);
    const railsFinished = rail!.progress >= 1;

    if (!railsFinished) return;
    this.world.destroyEntity(entity);
    this.rails.shift();
  }

  private createRail() {
    this.ensureRegularBending();
    const cameraRail = new CameraRail();
    cameraRail.rail = getCurve(this.curveProperties);
    this.rails.push(cameraRail);

    this.curveProperties.startPoint = cameraRail.rail.getPointAt(1);
    this.curveProperties.startTangent = cameraRail.rail.getTangentAt(1).normalize();
    this.curveProperties.turnDirection = new THREE.Vector3(
      Math.random() - 0.5,
      0,
      0
    ).normalize();

    this.world
      .createEntity()
      .add(cameraRail);
  }

  // Neccessary to prevent user from looking behind the tunel.
  private ensureRegularBending() {
    const needsSharpTurn = this.recentTurnStrengths.length >= 3 &&
      this.recentTurnStrengths.slice(-3).every(turn => turn < MAX_TURN_THRESHOLD);

    const turnStrength = needsSharpTurn
      ? MAX_TURN_THRESHOLD
      : MAX_TURN_THRESHOLD + Math.random() * MAX_TURN_THRESHOLD;

    this.curveProperties.turnStrength = turnStrength;
    this.recentTurnStrengths.push(turnStrength);
  }

  onEntityRemoved(_entity: Entity): void {}
}