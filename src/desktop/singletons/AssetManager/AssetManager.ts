import * as ASSET_TYPES from './ASSET_TYPES';
import preloadDisplacementGlowingTextureMaps from './preloadDisplacementGlowingTextureMaps';

class AssetManager {
  static instance = new AssetManager();

  private _textureMaps: ASSET_TYPES.TextureMapsRegistry = new Map();
  get textureMaps() { return this._textureMaps;}

  private constructor() {}
  
  async preload() {
    try {
      await this.preloadTextureMaps();
    } catch (err) {
      console.log('err');
      console.log(err);
    }
  } 

  private async preloadTextureMaps() {
    const metalPlateTextureMaps = await preloadDisplacementGlowingTextureMaps();
    this._textureMaps.set('metal_plate', metalPlateTextureMaps);
  }
}

export default AssetManager;