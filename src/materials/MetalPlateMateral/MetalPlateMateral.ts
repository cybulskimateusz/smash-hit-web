import AssetManager from '@src/singletons/AssetManager/AssetManager';
import { MeshStandardMaterial } from 'three';

class MetalPlateMaterial extends MeshStandardMaterial {
  constructor() {
    super({
      ...AssetManager.instance.textureMaps.get('metal_plate'),
      displacementScale: 0.1,
      metalness: 1,
      roughness: 1,
    });
  }
}

export default MetalPlateMaterial;