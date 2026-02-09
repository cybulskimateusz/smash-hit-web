import GlobalUniformsManager from '@src/managers/GlobalUniformsManager';
import * as THREE from 'three';

import fragmentShader from './GlassMaterial.frag';
import vertexShader from './GlassMaterial.vert';

class GlassMaterial extends THREE.ShaderMaterial {
  vertexShader = vertexShader;
  fragmentShader = fragmentShader;
  uniforms = {
    ...GlobalUniformsManager.instance.uniforms,
    uIndexesOfRefractionRGB: { value: new THREE.Vector3(0.53808, 0.55556, 0.58241) },
    uIndexesOfRefractionCYV: { value: new THREE.Vector3(0.53808, 0.55556, 0.58241) },
    uRefractionPower: { value: 0.1 },
    uChromaticAberration: { value: 1.0015 },
    uSaturation: { value: 1.02 }
  };
}

export default GlassMaterial;