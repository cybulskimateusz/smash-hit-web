import { Expose, Testable } from '@testable/index';

import  ExampleMesh  from './ExampleMesh';

@Testable({
  path: '/components/ExampleMesh',
  useOrbitControls: true,
  useFbnBackground: true,
})
export default class extends ExampleMesh {
  @Expose({ min: 0.5, max: 3, step: 0.1, folder: 'Scale', target: 'scale.x' })
  public _scaleX!: number;

  @Expose({ min: 0.5, max: 3, step: 0.1, folder: 'Scale', target: 'scale.y' })
  public _scaleY!: number;

  @Expose({ min: 0, max: Math.PI * 2, step: 0.01, folder: 'Rotation', target: 'rotation.x' })
  public _rotationX!: number;

  private _speed = 1;
  @Expose({ min: 0.1, max: 5, step: 0.1, folder: 'Animation' })
  public get speed() { return this._speed; }
  public set speed(value: number) {
    this._speed = value;
    this.timeline.timeScale(value);
  }
}
