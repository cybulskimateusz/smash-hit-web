import * as THREE from 'three';

import * as ASSET_TYPES from './ASSET_TYPES';
import preloadAudio, { SOUNDS } from './preloadAudio';
import preloadDisplacementGlowingTextureMaps from './preloadDisplacementGlowingTextureMaps';

class AssetManager {
  static instance = new AssetManager();

  private loadingManager = new THREE.LoadingManager();

  private _textureMaps: ASSET_TYPES.TextureMapsRegistry = new Map();
  get textureMaps() { return this._textureMaps;}

  private _audioMap = new Map<keyof typeof SOUNDS, AudioBuffer>();
  get audioMap() { return this._audioMap; }

  private constructor() {}
  
  async preload() {
    try {
      await this.preloadTextureMaps();
      await this.preloadAudio();
    } catch (err) {
      console.log(err);
    }
  } 

  private async preloadTextureMaps() {
    const metalPlateTextureMaps = await preloadDisplacementGlowingTextureMaps(this.loadingManager);
    this._textureMaps.set('walls_texture', metalPlateTextureMaps);
  }

  private async preloadAudio() {
    const preloadedAudioMap = await preloadAudio(this.loadingManager);
    Object.entries(preloadedAudioMap).forEach(([key, buffer]) => {
      this._audioMap.set(key as keyof typeof SOUNDS, buffer);
    });
  }
}

export default AssetManager;