/* eslint-disable max-lines */
import RAPIER from '@dimforge/rapier3d';
import type { GetExplosionMap3DProps } from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import getExplosionMap3D from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import autoBind from 'auto-bind';
import * as THREE from 'three';

type Debris = { mesh: THREE.Mesh; body: RAPIER.RigidBody };

class ShreddableModifier extends THREE.Object3D {
  private pieces: Debris[] = [];
  private _explosionMapProps: GetExplosionMap3DProps = {
    amount: 1024, outerRadius: 0.9, innerRadius: 0, boxSize: new THREE.Vector3(1, 1, 0.2)
  };

  constructor(private baseMesh: THREE.Mesh, explosionMapProps?: Partial<GetExplosionMap3DProps>) {
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
    this.baseMesh.geometry.computeBoundingBox();
    const meshBounds = this.baseMesh.geometry.boundingBox!.getSize(new THREE.Vector3());
    const worldPos = this.getWorldPosition(new THREE.Vector3());
    const center = [relativePoint.x, relativePoint.y] as [number, number];
    const map = getExplosionMap3D({ ...this._explosionMapProps, boxSize: meshBounds, center });
    this.clean();
    map.forEach(geo => {
      const mat = (this.baseMesh.material as THREE.ShaderMaterial).clone();
      mat.uniforms.uSceneTexture = { value: window.app.renderer.getBackgroundTexture(1) };
      const mesh = new THREE.Mesh(geo, mat);
      mesh.layers.set(1);
      geo.computeBoundingBox();
      const center = geo.boundingBox!.getCenter(new THREE.Vector3());
      const body = window.app.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(worldPos.x + center.x, worldPos.y + center.y, worldPos.z + center.z)
          // .setLinearDamping(0.5)
          // .setAngularDamping(0.5)
      );
      const hull = RAPIER.ColliderDesc.convexHull(geo.attributes.position.array as Float32Array);
      if (hull) window.app.world.createCollider(hull, body);
      const dir = center.sub(relativePoint).normalize();
      body.applyImpulse({ x: dir.x * 3, y: dir.y * 3 + 2, z: dir.z * 3 }, true);
      this.pieces.push({ mesh, body });
      this.add(mesh);
    });
  }

  public update() {
    const worldPos = this.getWorldPosition(new THREE.Vector3());
    this.pieces.forEach(({ mesh, body }) => {
      const p = body.translation(), r = body.rotation();
      mesh.position.set(p.x - worldPos.x, p.y - worldPos.y, p.z - worldPos.z);
      mesh.quaternion.set(r.x, r.y, r.z, r.w);
    });
  }

  public clean() {
    this.pieces.forEach(({ mesh, body }) => { mesh.removeFromParent(); window.app.world.removeRigidBody(body); });
    this.pieces = []; this.baseMesh.removeFromParent();
  }
  public reset() { this.clean(); this.add(this.baseMesh); }
}

export default ShreddableModifier;
