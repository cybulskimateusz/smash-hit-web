import RAPIER from '@dimforge/rapier3d';

class RigidBody {
  handle!: number;
  desc: RAPIER.RigidBodyDesc;
  gravityScale = 1;

  constructor() {
    this.desc = RAPIER.RigidBodyDesc.fixed();
  }
}

export default RigidBody;