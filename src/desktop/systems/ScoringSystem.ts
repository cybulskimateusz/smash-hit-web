import Collider from '@desktop/components/Collider';
import MeshSplitter from '@desktop/components/MeshSplitter';
import OwnedBy from '@desktop/components/OwnedBy';
import Player from '@desktop/components/Player';
import ScoreReward from '@desktop/components/ScoreReward';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import GameSettingsManager from '@desktop/singletons/GameSettingsManager';

export default class ScoringSystem extends System {
  update(): void {
    this.query(MeshSplitter, ScoreReward, Collider).forEach(this.awardPoints.bind(this));
  }

  private awardPoints(totem: Entity) {
    const splitter = totem.get(MeshSplitter)!;
    if (!splitter.shouldSplit) return;

    const reward = totem.get(ScoreReward)!;
    const collider = totem.get(Collider)!;

    if (collider.collisions.length === 0) return;

    const otherHandle = this.getOtherHandle(collider);
    const ball = this.findEntityByColliderHandle(otherHandle);

    if (!ball?.has(OwnedBy)) return;

    const owner = ball.get(OwnedBy)!.player;
    const player = owner.get(Player);

    totem.remove(ScoreReward);
    if (!player) return;

    player.score += reward.points;
    GameSettingsManager.instance.incrementDifficultyForScore(player.score);
  }

  private getOtherHandle(collider: Collider): number {
    const handles = collider.collisions[0].handles;
    return handles[0] === collider.handle ? handles[1] : handles[0];
  }

  private findEntityByColliderHandle(handle: number): Entity | undefined {
    return this.query(Collider).find(entity =>
      entity.get(Collider)?.handle === handle
    );
  }

  onEntityRemoved(_entity: Entity): void {}
}
