import { Vector3 } from 'three';

import type Entity from '../core/Entity';

class MeshSplitter {
  center = new Vector3(0, 0, 0);
  amount = 10;
  outerRadius = 1;
  innerRadius = 0;

  isSplitScheduled = false;
  shouldSplit = false;
  isSplitted = false;
  
  debris: Entity[] = [];
}

export default MeshSplitter;