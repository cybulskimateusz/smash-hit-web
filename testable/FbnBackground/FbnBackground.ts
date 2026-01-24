import autoBind from 'auto-bind';
import gsap from 'gsap';
import * as THREE from 'three';

import fragmentShader from './FbnBackground.frag';
import vertexShader from './FbnBackground.vert';

export class FbnBackground extends THREE.Mesh {
  private timeline = gsap.timeline({ repeat: -1 });
  override material: THREE.ShaderMaterial;

  constructor() {
    super();
    autoBind(this);

    this.geometry = new THREE.SphereGeometry(2, 32, 32);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
    });

    this.timeline
      .to(this.material.uniforms.uTime, {
        value: 10,
        duration: 20,
        ease: 'none',
      });

    this.scale.set(100, 100, 100);
  }
}