const loadDesktop = async () => {
  const { default: Game } = await import('./Game');
  const { default: AssetManager } = await import('./singletons/AssetManager/AssetManager');
  const { default: MainScene } = await import('./scenes/MainScene');
  document.querySelector('#dumbButton')?.remove();
  const canvas = document.querySelector('#app') as HTMLCanvasElement;
  await AssetManager.instance.preload();
  new Game(canvas, MainScene);
};

export default loadDesktop;