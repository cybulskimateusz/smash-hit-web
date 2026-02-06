import Debrie from '@src/components/Debrie'; 
import getExplosionMap3D from '@src/utils/three/getExplosionMap3D/getExplosionMap3D';
import autoBind from 'auto-bind';
import * as THREE from 'three';
import { Brush, Evaluator, INTERSECTION } from 'three-bvh-csg';

import MeshSplitter from '../../components/MeshSplitter';
import ThreeObject from '../../components/ThreeMesh';
import Transform from '../../components/Transform';
import type Entity from '../../Entity';
import System from '../../System';

class MeshSplitterSystem extends System {
  private csgEvaluator = new Evaluator();

  init(): void { autoBind(this); }
  update(): void {
    this.query(MeshSplitter, ThreeObject).forEach(this.splitEntity);
  }

  private splitEntity = (entity: Entity) => {
    const meshSplitter = entity.get(MeshSplitter);
    if (!meshSplitter?.isSplitted) return;

    const threeMesh = entity.get(ThreeObject);
    if (!threeMesh || !meshSplitter) return;
    console.log(threeMesh);

    const mesh = threeMesh.mesh;

    mesh.updateMatrixWorld(true);
    const relativePoint = mesh.worldToLocal(meshSplitter.center.clone());
    mesh.geometry.computeBoundingBox();
    const meshBounds = mesh.geometry.boundingBox?.getSize(new THREE.Vector3());
    if (!meshBounds) return;

    const center = [relativePoint.x, relativePoint.y] as [number, number];
    const cellGeometries = getExplosionMap3D({ ...meshSplitter, boxSize: meshBounds, center });

    const parent = mesh.parent;
    const meshWorldPos = mesh.getWorldPosition(new THREE.Vector3());
    const meshWorldQuat = mesh.getWorldQuaternion(new THREE.Quaternion());

    const sourceBrush = new Brush(mesh.geometry.clone());
    this.world.destroyEntity(entity);

    const pieces = cellGeometries.map(cellGeo => {
      cellGeo.computeBoundingBox();
      const cellCenter = cellGeo.boundingBox!.getCenter(new THREE.Vector3());
      cellGeo.translate(-cellCenter.x, -cellCenter.y, -cellCenter.z);

      const cellBrush = new Brush(cellGeo);
      cellBrush.position.copy(cellCenter);
      cellBrush.updateMatrixWorld();

      const result = this.csgEvaluator.evaluate(sourceBrush, cellBrush, INTERSECTION);

      result.geometry.computeBoundingBox();
      const pieceCenter = result.geometry.boundingBox!.getCenter(new THREE.Vector3());
      result.geometry.translate(-pieceCenter.x, -pieceCenter.y, -pieceCenter.z);

      result.geometry.applyQuaternion(meshWorldQuat);

      const material = (mesh.material as THREE.Material).clone();
      const pieceMesh = new ThreeObject();
      pieceMesh.usesGlobalUniforms = threeMesh.usesGlobalUniforms;
      pieceMesh.mesh = new THREE.Mesh(result.geometry, material);
      pieceMesh.mesh.position.copy(pieceCenter).applyQuaternion(meshWorldQuat).add(meshWorldPos);
      parent?.add(pieceMesh.mesh);

      const transform = new Transform();

      transform.position.copy(pieceMesh.mesh.position);

      const pieceEntity = this.world.createEntity();
      pieceEntity.add(transform).add(pieceMesh).add(new Debrie());
      return pieceEntity;
    }).filter(Boolean);

    meshSplitter.debris = pieces;
  };

  onEntityRemoved(_entity:Entity): void {}
}

export default MeshSplitterSystem;
