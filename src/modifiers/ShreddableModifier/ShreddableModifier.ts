import type App from '@src/App/App';
import type { GetExplosionMap3DProps } from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import getExplosionMap3D from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import autoBind from 'auto-bind';
import * as THREE from 'three';

// At this moment it supports only flat box - the easiest way to turn voronoi into 3D
class ShreddableModifier extends THREE.Object3D {
  private pieces: THREE.Mesh[] = [];
  private _explosionMapProps: GetExplosionMap3DProps = {
    amount: 128,
    outerRadius:0.4,
    innerRadius: 0,
    boxSize: new THREE.Vector3(1, 1, 0.2)
  };

  constructor(
    private app: App,
    private baseMesh: THREE.Mesh,
    explosionMapProps?: Partial<GetExplosionMap3DProps>
  ) {
    super();
    autoBind(this);
    this._explosionMapProps = { ...this._explosionMapProps, ...explosionMapProps };

    this.add(this.baseMesh);
  }

  public set explosionMapProps(props: Partial<GetExplosionMap3DProps>) {
    this._explosionMapProps = { ...this._explosionMapProps, ...props }; 
  }
  public get explosionMapProps() { return this._explosionMapProps; }

  public destroyAt(point: THREE.Vector3) {
    const relativePoint = this.baseMesh.worldToLocal(point.clone());
    const meshBounds = new THREE.Vector3();
    this.baseMesh.geometry.computeBoundingBox();
    this.baseMesh.geometry.boundingBox!.getSize(meshBounds);

    const explosionMap = getExplosionMap3D({
      ...this._explosionMapProps,
      boxSize: meshBounds,
      center: [relativePoint.x, relativePoint.y],
    });

    this.clean();
    
    explosionMap.forEach(geometry => {
      const piece = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
      this.pieces.push(piece);
      this.add(piece);
    });
  }

  public clean() {
    this.pieces.forEach(piece => piece.removeFromParent());
    this.pieces = [];
    this.baseMesh.removeFromParent();
  }

  public reset() {
    this.clean();
    this.add(this.baseMesh);
  }
}

export default ShreddableModifier;