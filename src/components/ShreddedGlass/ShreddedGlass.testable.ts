import { Expose, Testable } from '@testable/index';
import * as THREE from 'three';

import ShreddedGlass from './ShreddedGlass';

@Testable({
  path: '/components/ShreddedGlass',
  useFbnBackground: true,
  useOrbitControls: true
})
export default class extends ShreddedGlass {
  @Expose({ min: 3, max: 200, step: 1, folder: 'Settings' })
    pointsAmount = 128;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    outerRadius = 1.4;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    innerRadius = 0;

  @Expose({ folder: 'Triggers' })
    resetMesh = () => this.reset();

  constructor() {
    super();
  }

  override onClick(position: THREE.Vector3): void {
    if (this.mesh.explosionMapProps) {
      this.mesh.explosionMapProps = {
        amount: this.pointsAmount,
        outerRadius: this.outerRadius,
        innerRadius: this.innerRadius,
      };
    }
    super.onClick(position);
  }
}
