import EntityWithGlobalUniforms from '@src/components/EntityWithGlobalUniforms';
import ThreeMesh from '@src/components/ThreeMesh';
import type Entity from '@src/Entity';
import GlobalUniformsManager from '@src/managers/GlobalUniformsManager';
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

    GlobalUniformsManager.instance.uniforms.forEach((value, key) => {
      const uniform = material.uniforms[key];
      if (!uniform) return;
      uniform.value = value.value;
    });
  }
}

export default GlobalUniformsMaterialsSystem;