import * as THREE from 'three';

export type GlobalUniform =
  'gTime' |
  'gBackgroundSampler' |
  'gResolution';

class GlobalUniformsManager {
  static instance = new GlobalUniformsManager();
  private _uniforms: Record<GlobalUniform, THREE.IUniform> = {
    gBackgroundSampler: { value: null },
    gTime: { value: 0 },
    gResolution: { value: new THREE.Vector2() }
  };

  get uniforms() { return this._uniforms;}

  private constructor() {}
}

export default GlobalUniformsManager;