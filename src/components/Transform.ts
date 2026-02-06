import * as THREE from 'three';

class Transform {
  position = new THREE.Vector3();
  rotation = new THREE.Euler();
  scale = new THREE.Vector3(1, 1, 1);
}

export default Transform;