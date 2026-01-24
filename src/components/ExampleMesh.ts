import type App from '@src/App';
import autoBind from 'auto-bind';
import { gsap } from 'gsap';
import * as THREE from 'three';

import fragmentShader from './ExampleMesh.frag';
import vertexShader from './ExampleMesh.vert';

export class ExampleMesh extends THREE.Mesh {
  private _timeline: gsap.core.Timeline = gsap.timeline({ repeat: -1 });
  public get timeline() { return this._timeline; }
  private _uniforms = { uTime: { value: 0 } };
  public get uniforms() { return this._uniforms; }

  constructor(_app: App) {
    super();
    autoBind(this);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._uniforms,
    });
    this.geometry = geometry;
    this.material = material;

    this._timeline
      .to(this._uniforms.uTime, { value: Math.PI * 2, duration: 2, ease: 'none' })
      .to(this.rotation, { y: Math.PI * 2, duration: 4, ease: 'none' }, 0);
  }
}
