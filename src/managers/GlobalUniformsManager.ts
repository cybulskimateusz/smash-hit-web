import * as THREE from 'three';

export type GlobalUniform =
  'gTime' |
  'gBackgroundSampler';

class GlobalUniformsManager {
  static instance = new GlobalUniformsManager();
  private _uniforms: Record<GlobalUniform, THREE.IUniform> = {
    gBackgroundSampler: { value: null },
    gTime: { value: 0 }
  };

  get uniforms() { return this._uniforms;}
}

export default GlobalUniformsManager;