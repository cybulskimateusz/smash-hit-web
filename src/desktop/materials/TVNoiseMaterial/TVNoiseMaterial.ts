import GlobalUniformsManager from '@desktop/singletons/GlobalUniformsManager';
import * as THREE from 'three';

import fragmentShader from './TVNoiseMaterial.frag';
import vertexShader from './TVNoiseMaterial.vert';

class TVNoiseMaterial extends THREE.ShaderMaterial {
  vertexShader = vertexShader;
  fragmentShader = fragmentShader;
  uniforms = GlobalUniformsManager.instance.uniforms;
}

export default TVNoiseMaterial;
