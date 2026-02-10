import GlobalUniformsManager from '@src/managers/GlobalUniformsManager';
import * as THREE from 'three';

import fragmentShader from './FireflyMaterial.frag';
import vertexShader from './FireflyMaterial.vert';

class FireflyMaterial extends THREE.ShaderMaterial {
  vertexShader = vertexShader;
  fragmentShader = fragmentShader;
  transparent = true;
  depthWrite = false;
  blending = THREE.AdditiveBlending;
  uniforms = {
    ...GlobalUniformsManager.instance.uniforms,
    uColor: { value: new THREE.Color(0.4, 1.0, 0.3) },
  };
}

export default FireflyMaterial;
