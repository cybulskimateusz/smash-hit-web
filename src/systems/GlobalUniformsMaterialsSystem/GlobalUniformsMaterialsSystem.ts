import ThreeMesh from '@src/components/ThreeMesh';
import type Entity from '@src/core/Entity';
import System from '@src/core/System';
import GlobalUniformsManager, { type GlobalUniform } from '@src/singletons/GlobalUniformsManager';
import type { ShaderMaterial } from 'three';

class GlobalUniformsMaterialsSystem extends System {
  onEntityRemoved(_entity: Entity): void {}

  update(): void {
    this.query(ThreeMesh).forEach(this.updateMaterialUniforms);
  }

  private updateMaterialUniforms(entity: Entity) {
    const threeMesh = entity.get(ThreeMesh);
    if (!threeMesh || !threeMesh.usesGlobalUniforms) return;

    // Setting upper layer for mesh so gBackgroundSampler ignores the mesh
    threeMesh.mesh.layers.set(1);

    const material = threeMesh.mesh.material as ShaderMaterial;
    if (!material) return;

    for (const uniform in GlobalUniformsManager.instance.uniforms) {
      material.uniforms[uniform].value =
      GlobalUniformsManager.instance.uniforms[uniform as GlobalUniform].value;
    }
  }
}

export default GlobalUniformsMaterialsSystem;