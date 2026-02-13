import autoBind from 'auto-bind';

class ClockManager {
  static instance = new ClockManager();

  private animationFrame?: ReturnType<typeof requestAnimationFrame>;

  private startTime = Date.now();
  private _currentTime = 0;
  public get currentTime() {return this._currentTime; }

  private constructor() {
    autoBind(this);
    this.onFocus();
    this.addEventListeners();
  }

  private update() {
    this.animationFrame = requestAnimationFrame(this.update);
    this._currentTime = Date.now() - this.startTime;
  }

  private onFocus() {
    if (this.animationFrame) return;
    this.startTime = Date.now() - this._currentTime;
    this.update();
  }

  private onBlur() {
    if (!this.animationFrame) return;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = undefined;
  }

  private addEventListeners() {
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur', this.onBlur);
  }

  public destroy() {
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('blur', this.onBlur);
  }
}

export default ClockManager;