import autoBind from 'auto-bind';
import * as THREE from 'three';

import type GameScene from '../components/GameScene';
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
  private backgroundTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    samples: 4,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
  });
  public isRunning = true;
  public scene?: GameScene;
  public clock = new THREE.Clock();

  constructor(private props: RenderingManagerProps) {
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
    this.clock.getElapsedTime();
  }

  private animationLoop() {
    if (!this.isRunning) {
      this.clock.stop();
      return;
    }
    if (!this.clock.running) this.clock.running = true;

    this.applyUniforms();

    if (!this.scene) return;
    this.props.onUpdate();

    this.scene.camera.layers.set(0);
    this.setRenderTarget(this.backgroundTarget);
    this.render(this.scene, this.scene.camera);

    this.setRenderTarget(null);
    this.scene.camera.layers.enableAll();
    this.render(this.scene, this.scene.camera);
  }

  private applyUniforms() {
    const backgroundUniform = GlobalUniformsManager.instance.uniforms.gBackgroundSampler;
    if (backgroundUniform) backgroundUniform.value = this.backgroundTarget.texture;

    const timeUniform = GlobalUniformsManager.instance.uniforms.gTime;
    if (timeUniform) timeUniform.value = this.clock.getElapsedTime();

    const resolutionUniform = GlobalUniformsManager.instance.uniforms.gResolution;
    if (resolutionUniform) {
      const uniform = resolutionUniform.value as THREE.Vector2;
      uniform.set(window.innerWidth, window.innerHeight);
      uniform.multiplyScalar(Math.min(window.devicePixelRatio, 2));
    }
  }

  public onResize() {
    const { width, height } = this.props.canvas.getBoundingClientRect();
    this.setSize(width, height);
    this.setPixelRatio(window.devicePixelRatio);
    this.backgroundTarget.setSize(width, height);
  }

  public destroy() {
    this.removeEventListeners();
    this.dispose();
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('focus', () => (this.isRunning = true));
    window.addEventListener('blur', () => (this.isRunning = false));
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('focus', () => (this.isRunning = true));
    window.removeEventListener('blur', () => (this.isRunning = false));
  }
}

export default RenderingManager;