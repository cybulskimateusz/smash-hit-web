import * as THREE from 'three';

class GlobalUniformsManager {
  static instance = new GlobalUniformsManager();
  private _uniforms: Map<string, THREE.IUniform> = new Map();

  get uniforms() { return this._uniforms;}
}

export default GlobalUniformsManager;