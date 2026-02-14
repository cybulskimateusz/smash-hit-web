import type Entity from '@desktop/core/Entity';
import type * as THREE from 'three';

class Corridor {
  curve!: THREE.CubicBezierCurve3;
  radius!: number;

  children: Entity[] = [];
}

export default Corridor;