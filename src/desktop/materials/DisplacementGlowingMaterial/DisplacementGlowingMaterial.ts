import AssetManager from '@desktop/singletons/AssetManager/AssetManager';
import * as THREE from 'three';

const EMISSIVE_INTENSITY_BASE = 1.75;

class DisplacementGlowingMaterial extends THREE.MeshStandardMaterial {
  private _emissiveIntensityRatio = EMISSIVE_INTENSITY_BASE;

  constructor() {
    super({
      ...AssetManager.instance.textureMaps.get('walls_texture'),
      color: 0x000000,
      emissiveIntensity: 1.77,
      emissive: 0xffffff,
    });
  }

  set emissionRatio(value: number) {
    this._emissiveIntensityRatio = value / EMISSIVE_INTENSITY_BASE;
  }

  // Ensures brightness looks consistent across different emissive
  // colors by adjusting intensity based on perceived luminance
  set glowColor(value: THREE.Color) {
    super.emissive = value;
    const luminance = 0.2126 * value.r + 0.7152 * value.g + 0.0722 * value.b;
    this.emissiveIntensity = this._emissiveIntensityRatio * (0.5 / Math.max(0.05, luminance));
  }
}

export default DisplacementGlowingMaterial;