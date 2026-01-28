import autoBind from 'auto-bind';
import * as THREE from 'three';

type LayeredRendererParameters = Omit<THREE.WebGLRendererParameters, 'canvas'> & {
    canvas: HTMLCanvasElement;
}

class LayeredRenderer extends THREE.WebGLRenderer {
  private _layerCount: number;
  private _renderTargets: THREE.WebGLRenderTarget[];

  constructor(parameters: LayeredRendererParameters, layers: number) {
    super(parameters);
    autoBind(this);

    this._layerCount = layers;
    this._renderTargets = [];

    // Create render targets for layers 0..(layers-1)
    // renderTargets[i] will contain the cumulative render of layers 0..i
    for (let i = 0; i < layers; i++) {
      this._renderTargets.push(new THREE.WebGLRenderTarget(
        parameters.canvas.clientWidth,
        parameters.canvas.clientHeight
      ));
    }

    this.onResize();
    this.addEventListeners();

    this.setAnimationLoop(() => {
      // Render only layer 0 to texture (for glass background)
      window.app.camera.layers.set(0);
      this.setRenderTarget(this._renderTargets[0]!);
      this.render(window.app.scene, window.app.camera);

      // Final pass: render all layers to screen
      this.setRenderTarget(null);
      window.app.camera.layers.enableAll();
      this.render(window.app.scene, window.app.camera);
    });
  }
  
  public getBackgroundTexture(layer: number): THREE.Texture | null {
    if (layer <= 0) return null;
    return this._renderTargets[layer - 1]?.texture ?? null;
  }

  public destroy() {
    this.removeEventListeners();
    this._renderTargets.forEach(target => target.dispose());
    this.dispose();
  }

  public onResize() {
    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio);
    this._renderTargets.forEach(target => {
      target.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}

export default LayeredRenderer;