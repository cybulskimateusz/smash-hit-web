import type { SOUNDS } from '../singletons/AssetManager/preloadAudio';

class Audible {
  audio!: keyof typeof SOUNDS;

  shouldPlay = false;
  infinite = false;
}

export default Audible;