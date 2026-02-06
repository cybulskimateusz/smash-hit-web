import GlobalUniformsManager from '@src/managers/GlobalUniformsManager';
import * as THREE from 'three';

import fragmentShader from './GlassMaterial.frag';
import vertexShader from './GlassMaterial.vert';

class GlassMaterial extends THREE.ShaderMaterial {
  vertexShader = vertexShader;
  fragmentShader = fragmentShader;
  uniforms = {
    ...GlobalUniformsManager.instance.uniforms,
    uIndexesOfRefraction: { value: new THREE.Vector3(0.53808, 0.55556, 0.58241) },
    uRefractionPower: { value: 0.3 },
    uChromaticAberration: { value: 1.0015 }
  };
}

export default GlassMaterial;