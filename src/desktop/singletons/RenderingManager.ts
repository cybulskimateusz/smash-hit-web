import autoBind from 'auto-bind';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import type GameScene from '../components/GameScene';
import ClockManager from './ClockManager';
import GlobalUniformsManager from './GlobalUniformsManager';

interface RenderingManagerProps {
    canvas: HTMLCanvasElement;
    onUpdate: (...args: unknown[]) => void;
}

/**
 * Manages work of 2 parallel renderers, and makes sure
 * the first one is stored as a global uniform
 */
class RenderingManager extends THREE.WebGLRenderer {
  private static _instance: RenderingManager;

  static init(props: RenderingManagerProps) {
    if (RenderingManager._instance)
      throw new Error('RenderingManager is already initialized');

    RenderingManager._instance = new RenderingManager(props);
    return RenderingManager._instance;
  }

  static get instance() {
    if (!RenderingManager._instance)
      throw new Error('RenderingManager is not initialized. Call RenderingManager.init() first.');

    return RenderingManager._instance;
  }

  private backgroundTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    samples: 4,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
  });

  private _scene?: GameScene;
  public get scene() { return this._scene; }
  public set scene(value: GameScene | undefined) {
    this._scene = value;
    this.initPostProcessing();
  }

  private composer?: EffectComposer;
  public clockManager = ClockManager.instance;

  private constructor(private props: RenderingManagerProps) {
    super({
      antialias: true,
      powerPreference: 'high-performance',
      canvas: props.canvas,
    });
    autoBind(this);

    this.onResize();
    this.addEventListeners();

    this.setAnimationLoop(this.animationLoop);

    GlobalUniformsManager.instance.uniforms.gBackgroundSampler.value =
    this.backgroundTarget.texture;

    GlobalUniformsManager.instance.uniforms.gTime.value =
    this.clockManager.currentTime;
  }

  private initPostProcessing() {
    if (!this.scene) return;

    this.composer = new EffectComposer(this);

    const renderPass = new RenderPass(this.scene, this.scene.world.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    this.composer.addPass(bloomPass);
  }

  private animationLoop() {
    this.applyUniforms();

    if (!this.scene) return;
    this.props.onUpdate();

    this.scene.world.camera.layers.set(0);
    this.setRenderTarget(this.backgroundTarget);
    this.render(this.scene, this.scene.world.camera);

    this.setRenderTarget(null);
    this.scene.world.camera.layers.enableAll();

    if (this.composer) {
      this.composer.render();
    } else {
      this.render(this.scene, this.scene.world.camera);
    }
  }

  private applyUniforms() {
    const backgroundUniform = GlobalUniformsManager.instance.uniforms.gBackgroundSampler;
    if (backgroundUniform) backgroundUniform.value = this.backgroundTarget.texture;

    const timeUniform = GlobalUniformsManager.instance.uniforms.gTime;
    if (timeUniform) timeUniform.value = this.clockManager.currentTime;

    const resolutionUniform = GlobalUniformsManager.instance.uniforms.gResolution;
    if (resolutionUniform) {
      const uniform = resolutionUniform.value as THREE.Vector2;
      uniform.set(window.innerWidth, window.innerHeight);
      uniform.multiplyScalar(Math.min(window.devicePixelRatio, 2));
    }
  }

  public onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.setSize(width, height, false);
    this.setPixelRatio(window.devicePixelRatio);
    this.backgroundTarget.setSize(width, height);
    this.composer?.setSize(width, height);
  }

  public destroy() {
    this.removeEventListeners();
    this.dispose();
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}

export default RenderingManager;
