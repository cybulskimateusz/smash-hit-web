import autoBind from 'auto-bind';

class PermissionManager {
  static instance = new PermissionManager();
  private _accepted = false;

  private constructor() {
    autoBind(this);
  }

  async request(): Promise<boolean> {
    // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
      // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
        const permission = await DeviceOrientationEvent.requestPermission();
        this._accepted = permission === 'granted';
      } catch {
        this._accepted = false;
      }
    } else {
      this._accepted = true;
    }
  
    return this._accepted;
  }
}

export default PermissionManager;