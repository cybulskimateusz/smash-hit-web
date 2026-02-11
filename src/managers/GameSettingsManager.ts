const DIFFICULTY_SCORE_RATIO = 5;

class GameSettingsManager {
  static instance = new GameSettingsManager();

  private _difficulty = 1;
  public get difficulty() { return this._difficulty; }

  public incrementDifficultyForScore(score: number) {
    if (score % DIFFICULTY_SCORE_RATIO) return;

    const expectedDifficulty = score / DIFFICULTY_SCORE_RATIO;
    if (expectedDifficulty <= this._difficulty) return;

    this._difficulty = expectedDifficulty;
  }
}

export default GameSettingsManager;