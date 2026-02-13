import * as THREE from 'three';

class Player {
  id!: string;
  color: THREE.ColorRepresentation = 0xff0000;
  score = 0;
}

export default Player;