import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/Addons.js';

import type { TextureMaps } from './ASSET_TYPES';

const configureTexture = (texture: THREE.Texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 32;
};

const preloadDisplacementGlowingTextureMaps = async (): Promise<TextureMaps> => {
  const textureLoader = new THREE.TextureLoader();
  const exrLoader = new EXRLoader();

  const [emissiveMap, normalMap, map, displacementMap, roughnessMap, metalnessMap] = await Promise.all([
    textureLoader.loadAsync('/assets/metal_plate_material/emissive.png'),
    textureLoader.loadAsync('/assets/metal_plate_material/normal.png'),
    textureLoader.loadAsync('/assets/metal_plate_material/diffuse.jpg'),
    textureLoader.loadAsync('/assets/metal_plate_material/displacement.png'),
    exrLoader.loadAsync('/assets/metal_plate_material/roughness.exr'),
    exrLoader.loadAsync('/assets/metal_plate_material/metalness.exr'),
  ]);
  
  [emissiveMap, normalMap, map, displacementMap, roughnessMap, metalnessMap].forEach(configureTexture);

  return { emissiveMap, normalMap, map, displacementMap, roughnessMap, metalnessMap };
};

export default preloadDisplacementGlowingTextureMaps;