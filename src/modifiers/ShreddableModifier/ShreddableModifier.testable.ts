import { Expose, Testable } from '@testable/index';
import * as THREE from 'three';

import ShreddableModifier from './ShreddableModifier';

const testedMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 0.2), new THREE.MeshBasicMaterial({ wireframe: true }));

@Testable({
  path: '/modifiers/ShreddableModifier',
  useFbnBackground: true,
  useOrbitControls: true
})
export default class extends ShreddableModifier {
  @Expose({ min: 3, max: 200, step: 1, folder: 'Settings' })
    pointsAmount = 128;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    outerRadius = 0.07;

  @Expose({ min: 0.0, max: 10, step: 0.1, folder: 'Settings' })
    innerRadius = 0;

  @Expose({ min: -2.5, max: 2.5, step: 0.0001, folder: 'Settings' })
    centerPointX = 0;

  @Expose({ min: -5, max: 5, step: 0.0001, folder: 'Settings' })
    centerPointY = 0;

  @Expose({ folder: 'Triggers' })
    destroyMesh = () => this.destroyAt();

  @Expose({ folder: 'Triggers' })
    resetMesh = () => this.reset();

  constructor() {
    super(testedMesh);
  }

  override destroyAt(): void {
    if (this.explosionMapProps) {
      this.explosionMapProps = {
        amount: this.pointsAmount,
        outerRadius: this.outerRadius,
        innerRadius: this.innerRadius,
      };
    }
    const position = new THREE.Vector3(this.centerPointX, this.centerPointY, 0);
    super.destroyAt(position);
  }
}
