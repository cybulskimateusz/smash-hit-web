import MaterialWithGlobalUniforms from '@src/components/EntityWithGlobalUniforms';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import TestableScene from '@testable/TestableScene';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import RenderSystem from '../RenderSystem';
import GlobalUniformsMaterialsSystem from './GlobalUniformsMaterialsSystem';

export default class extends TestableScene {
  static path = '/systems/GlobalUniformsMaterial';

  init() {
    this.world.addSystem(new RenderSystem(this));
    this.world.addSystem(new GlobalUniformsMaterialsSystem());

    this.spawnFloor();
    const entity = this.world.createEntity();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        gTime: { value: 0 },
        gBackgroundSampler: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec4 vScreenPos;

        void main() {
          vUv = uv;
          vNormal = normalMatrix * normal;
          vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vScreenPos = clipPos;
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform float gTime;
        uniform sampler2D gBackgroundSampler;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec4 vScreenPos;

        vec2 rotate(vec2 uv, vec2 center, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          vec2 p = uv - center;
          return vec2(p.x * c - p.y * s, p.x * s + p.y * c) + center;
        }

        void main() {
          // Screen UV for background sampling
          vec2 screenUv = (vScreenPos.xy / vScreenPos.w) * 0.5 + 0.5;

          // Rotate UV around center based on time
          vec2 rotatedUv = rotate(screenUv, vec2(0.5), gTime * 0.5);

          // Add slight distortion based on normal
          vec2 distortion = vNormal.xy * 0.02;
          vec3 color = texture2D(gBackgroundSampler, rotatedUv + distortion).rgb;

          // Fresnel rim
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 5.0);
          color += fresnel * 3.0;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const threeMesh = new ThreeMesh();
    threeMesh.mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
    threeMesh.mesh.layers.set(1);

    entity.add(threeMesh).add(new MaterialWithGlobalUniforms()).add(new Transform());

    new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(0, 0, 5);
  }
}