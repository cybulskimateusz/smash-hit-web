import Corridor from '@desktop/components/Corridor';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import createTotem from '@desktop/prefabs/entities/createTotem';
import OwnedBy from '@src/desktop/components/OwnedBy';
import ScoreReward from '@src/desktop/components/ScoreReward';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class SpawnTotemsSystem extends System {
  private processedCorridors: Entity[] = [];
  private readonly totemsPerCorridor = 1;

  constructor() {
    super();
    autoBind(this);
  }

  init(): void {}

  update(): void {
    this.query(Corridor).forEach(this.spawnTotemsInCorridor);
    this.query(ScoreReward, OwnedBy).forEach(this.cleanUnowned);
  }

  private spawnTotemsInCorridor(entity: Entity): void {
    if (this.processedCorridors.includes(entity)) return;
    this.processedCorridors.push(entity);

    const { curve, radius } = entity.get(Corridor)!;

    for (let i = 0; i < this.totemsPerCorridor; i++) {
      const t = Math.random();
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const realUp = new THREE.Vector3().crossVectors(right, tangent).normalize();

      const angle = Math.random() * Math.PI * 2;
      const offset = new THREE.Vector3()
        .addScaledVector(right, Math.cos(angle) * radius * 0.5)
        .addScaledVector(realUp, Math.sin(angle) * radius * 0.5);

      const totem = createTotem(this.world, {
        position: position.add(offset)
      });
      const ownedBy = new OwnedBy();
      ownedBy.owner = entity;
      totem.add(ownedBy);
    }
  }

  private cleanUnowned(entity: Entity): void {
    const ownedBy = entity.get(OwnedBy);
    if (this.world.entities.includes(ownedBy!.owner)) return;
    this.world.destroyEntity(entity);
  }

  onEntityRemoved(_entity: Entity): void {}
}
