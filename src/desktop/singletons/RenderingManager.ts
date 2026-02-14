import autoBind from 'auto-bind';
import * as THREE from 'three';

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
  public scene?: GameScene;
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

  private animationLoop() {
    this.applyUniforms();

    if (!this.scene) return;
    this.props.onUpdate();

    this.scene.world.camera.layers.set(0);
    this.setRenderTarget(this.backgroundTarget);
    this.render(this.scene, this.scene.world.camera);

    this.setRenderTarget(null);
    this.scene.world.camera.layers.enableAll();
    this.render(this.scene, this.scene.world.camera);
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
