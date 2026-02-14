import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/Addons.js';

import type { TextureMaps } from './ASSET_TYPES';

const configureTexture = (texture: THREE.Texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
};

const preloadMetalPlateTextureMaps = async (): Promise<TextureMaps> => {
  const textureLoader = new THREE.TextureLoader();
  const exrLoader = new EXRLoader();

  const [map, displacementMap, roughnessMap, normalMap, metalnessMap] = await Promise.all([
    textureLoader.loadAsync('/assets/metal_plate_material/diffuse.jpg'),
    textureLoader.loadAsync('/assets/metal_plate_material/displacement.png'),
    exrLoader.loadAsync('/assets/metal_plate_material/roughness.exr'),
    exrLoader.loadAsync('/assets/metal_plate_material/normal.exr'),
    exrLoader.loadAsync('/assets/metal_plate_material/metalness.exr')
  ]);
  
  configureTexture(map);
  configureTexture(displacementMap);
  configureTexture(roughnessMap);
  configureTexture(normalMap);
  configureTexture(metalnessMap);

  return { map, displacementMap, roughnessMap, normalMap, metalnessMap };
};

export default preloadMetalPlateTextureMaps;