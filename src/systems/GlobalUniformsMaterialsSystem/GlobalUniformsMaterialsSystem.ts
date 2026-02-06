import EntityWithGlobalUniforms from '@src/components/EntityWithGlobalUniforms';
import ThreeMesh from '@src/components/ThreeMesh';
import type Entity from '@src/Entity';
import GlobalUniformsManager, { type GlobalUniform } from '@src/managers/GlobalUniformsManager';
import System from '@src/System';
import type { ShaderMaterial } from 'three';

class GlobalUniformsMaterialsSystem extends System {
  onEntityRemoved(_entity: Entity): void {}

  update(): void {
    this.query(EntityWithGlobalUniforms).forEach(this.updateMaterialUniforms);
  }

  private updateMaterialUniforms(entity: Entity) {
    const mesh = entity.get(ThreeMesh)?.mesh;
    if (!mesh) return;

    const material = mesh.material as ShaderMaterial;
    if (!material) return;

    for (const uniform in GlobalUniformsManager.instance.uniforms) {
      material.uniforms[uniform].value =
      GlobalUniformsManager.instance.uniforms[uniform as GlobalUniform].value;
    }
  }
}

export default GlobalUniformsMaterialsSystem;