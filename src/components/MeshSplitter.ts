import { Vector3 } from 'three';

import type Entity from '../Entity';

class MeshSplitter {
  center = new Vector3(0, 0, 0);
  amount = 10;
  outerRadius = 1;
  innerRadius = 0;

  isSplitted = false;
  debris: Entity[] = [];
}

export default MeshSplitter;