import Debrie from '@src/components/Debrie'; 
import MeshSplitter from '@src/components/MeshSplitter';
import Temporary from '@src/components/Temporary';
import ThreeObject from '@src/components/ThreeMesh';
import ThreeMesh from '@src/components/ThreeMesh';
import Transform from '@src/components/Transform';
import type Entity from '@src/core/Entity'; 
import getExplosionMap3D from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import autoBind from 'auto-bind';
import * as THREE from 'three';
import { Brush, Evaluator, INTERSECTION } from 'three-bvh-csg';

import QueuedWorkSystem from '../QueuedWorkSystem/QueuedWorkSystem';

interface MeshSplitterDebrie {
  reference: Entity;
  referenceBrush: Brush;
  geometry: THREE.ExtrudeGeometry;
  index: number;
}
class MeshSplitterSystem extends QueuedWorkSystem {
  worksPerFrame = 1;
  private csgEvaluator = new Evaluator();

  init(): void { autoBind(this); }
  update(): void {
    this.query(MeshSplitter, ThreeObject).forEach(this.scheduleSplit);
    super.update();
  }

  private scheduleSplit(entity: Entity) {
    const meshSplitter = entity.get(MeshSplitter);
    if (!meshSplitter?.shouldSplit || meshSplitter.isSplitScheduled) return;
    meshSplitter.isSplitScheduled = true;

    const threeMesh = entity.get(ThreeObject);
    if (!threeMesh || !meshSplitter) return;

    const mesh = threeMesh.mesh;

    mesh.updateMatrixWorld(true);
    const relativePoint = mesh.worldToLocal(meshSplitter.center.clone());
    mesh.geometry.computeBoundingBox();
    const meshBounds = mesh.geometry.boundingBox?.getSize(new THREE.Vector3());
    if (!meshBounds) return;

    const center = [relativePoint.x, relativePoint.y] as [number, number];
    const cellGeometries = getExplosionMap3D({ ...meshSplitter, boxSize: meshBounds, center });

    const sourceBrush = new Brush(mesh.geometry.clone());

    const pieces = cellGeometries.map((geometry, index) => ({
      geometry,
      reference: entity,
      referenceBrush: sourceBrush,
      index,
    })).filter(Boolean);

    this.queueWork({
      callback: this.createDebrie,
      items: pieces,
      onFinished: () => {
        meshSplitter.isSplitted = true;
        this.world.destroyEntity(entity);
      },
    });
  };

  private createDebrie(item: MeshSplitterDebrie) {
    item.geometry.computeBoundingBox();
    const cellCenter = item.geometry.boundingBox!.getCenter(new THREE.Vector3());
    item.geometry.translate(-cellCenter.x, -cellCenter.y, -cellCenter.z);

    const refenceTransform = item.reference.get(Transform)!;
    const refenceMesh = item.reference.get(ThreeMesh)!;

    const cellBrush = new Brush(item.geometry);
    cellBrush.position.copy(cellCenter);
    cellBrush.updateMatrixWorld();

    // MeshBVH: "maxLeafTris" option has been deprecated. - the warn does not affect the effect
    const originalWarn = console.warn;
    console.warn = () => {};
    const result = this.csgEvaluator.evaluate(item.referenceBrush, cellBrush, INTERSECTION);
    console.warn = originalWarn;

    result.geometry.computeBoundingBox();
    const pieceCenter = result.geometry.boundingBox!.getCenter(new THREE.Vector3());
    result.geometry.translate(-pieceCenter.x, -pieceCenter.y, -pieceCenter.z);

    // THREE.UniformsUtils: Textures of render targets cannot be cloned - this is expected behavior
    const savedWarn = console.warn;
    console.warn = () => {};
    const material = (refenceMesh.mesh.material as THREE.Material).clone();
    console.warn = savedWarn;
    
    const pieceMesh = new ThreeObject();
    pieceMesh.usesGlobalUniforms = refenceMesh.usesGlobalUniforms;
    pieceMesh.mesh = new THREE.Mesh(result.geometry, material);

    const transform = new Transform();
    transform.position.copy(pieceCenter).add(refenceTransform.position);
    transform.rotation.copy(refenceTransform.rotation);

    const pieceEntity = this.world.createEntity();
    pieceEntity
      .add(transform)
      .add(pieceMesh)
      .add(new Debrie())
      .add(new Temporary());

    item.reference.get(MeshSplitter)!.debris.push(pieceEntity);
  }

  onEntityRemoved(_entity:Entity): void {}
}

export default MeshSplitterSystem;
