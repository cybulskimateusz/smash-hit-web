import Audible from '@desktop/components/Audible';
import Transform from '@desktop/components/Transform';
import type Entity from '@desktop/core/Entity';
import System from '@desktop/core/System';
import AssetManager from '@desktop/singletons/AssetManager/AssetManager';
import autoBind from 'auto-bind';
import * as THREE from 'three';

export default class AudibleSystem extends System {
  private listener?: THREE.AudioListener;
  private processedEntities: Entity[] = [];

  constructor(private scene: THREE.Scene) {
    super();
    autoBind(this);
  }

  init() {
    this.listener = this.world.camera.children.find(
      child => child instanceof THREE.AudioListener
    ) as THREE.AudioListener;

    if (!this.listener) {
      console.warn('AudibleSystem: No THREE.AudioListener found on the camera.');
    }
  }

  update() {
    if (!this.listener) return;

    this.query(Audible).forEach(this.playSoundForEntity);
  }

  private playSoundForEntity(entity: Entity) {
    if (this.processedEntities.includes(entity)) return;

    const audible = entity.get(Audible)!;
    const transform = entity.get(Transform);

    if (!audible.shouldPlay) return;

    const audioBuffer = AssetManager.instance.audioMap.get(audible.audio);

    if (!audioBuffer) return;

    this.processedEntities.push(entity);

    const sound = transform ? new THREE.PositionalAudio(this.listener!) : new THREE.Audio(this.listener!);
    if (transform) sound.position.copy(transform.position);
    
    sound.setBuffer(audioBuffer);
    sound.setLoop(audible.infinite);
    this.scene.add(sound);
    sound.play();

    if (audible.infinite) return;
    sound.onEnded = () => sound.removeFromParent();
    entity.remove(Audible);
  }

  onEntityRemoved(_entity: Entity): void {}
}