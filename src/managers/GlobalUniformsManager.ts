import * as THREE from 'three';

export type GlobalUniform =
  'gTime' |
  'gBackgroundSampler';

class GlobalUniformsManager {
  static instance = new GlobalUniformsManager();
  private _uniforms: Map<GlobalUniform, THREE.IUniform> = new Map();

  get uniforms() { return this._uniforms;}
}

export default GlobalUniformsManager;