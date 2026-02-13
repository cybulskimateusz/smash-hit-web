import * as ASSET_TYPES from './ASSET_TYPES';
import preloadMetalPlateTextureMaps from './preloadMetalPlateTextureMaps';

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
    const metalPlateTextureMaps = await preloadMetalPlateTextureMaps();
    this._textureMaps.set('metal_plate', metalPlateTextureMaps);
  }
}

export default AssetManager;