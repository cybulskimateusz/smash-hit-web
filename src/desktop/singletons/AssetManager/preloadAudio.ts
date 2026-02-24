import * as THREE from 'three';

export const SOUNDS = {
  shratterGlass: '/assets/audio/shatter_glass.mp3',
  background: '/assets/audio/noise_air.mp3',
  shot: '/assets/audio/shot.mp3',
};

const preloadAudio = async (loadingManager: THREE.LoadingManager) => {
  const audioLoader = new THREE.AudioLoader(loadingManager);

  const audioBuffers = await Promise.all(
    Object.entries(SOUNDS).map(([key, url]) =>
      audioLoader.loadAsync(url).then(buffer => ({ key, buffer }))
    )
  );

  const audioMap: Record<string, AudioBuffer> = {};
  audioBuffers.forEach(({ key, buffer }) => {
    audioMap[key] = buffer;
  });

  return audioMap;
};

export default preloadAudio;