import type Entity from '@src/core/Entity';
import type * as THREE from 'three';

class Corridor {
  curve!: THREE.CubicBezierCurve3;
  radius!: number;

  children: Entity[] = [];
}

export default Corridor;