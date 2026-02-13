import * as THREE from 'three';

class CameraRail {
  rail!: THREE.CubicBezierCurve3;
  progress = 0;
}

export default CameraRail;