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
  private backgroundTarget = new THREE.WebGLRenderTarget();
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

    GlobalUniformsManager.instance.uniforms.set(
      'gBackgroundSampler',
      { value: this.backgroundTarget.texture }
    );
    this.setAnimationLoop(this.animationLoop);
  }

  private animationLoop() {
    if (!this.isRunning) {
      this.clock.stop();
      return;
    }

    GlobalUniformsManager.instance.uniforms.set(
      'gTime',
      { value: this.clock.getElapsedTime() }
    );

    if (!this.scene) return;
    this.props.onUpdate();

    this.scene.camera.layers.set(0);
    this.setRenderTarget(this.backgroundTarget);
    this.render(this.scene, this.scene.camera);

    this.setRenderTarget(null);
    this.scene.camera.layers.enableAll();
    this.render(this.scene, this.scene.camera);
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