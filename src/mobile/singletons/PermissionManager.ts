import autoBind from 'auto-bind';

class PermissionManager {
  static instance = new PermissionManager();
  private _accepted = false;

  static get isRequired(): boolean {
    return (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
      typeof DeviceOrientationEvent.requestPermission === 'function'
    );
  }

  private constructor() {
    autoBind(this);
  }

  async request(): Promise<boolean> {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
        const permission = await DeviceOrientationEvent.requestPermission();
        this._accepted = permission === 'granted';
      } catch (err) {
        console.error('[PermissionManager] requestPermission failed:', err);
        this._accepted = false;
      }
    } else {
      this._accepted = true;
    }

    return this._accepted;
  }
}

export default PermissionManager;