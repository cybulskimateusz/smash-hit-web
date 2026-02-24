import RAPIER from '@dimforge/rapier3d';

class RigidBody {
  handle!: number;
  desc: RAPIER.RigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
  gravityScale = 1;
}

export default RigidBody;