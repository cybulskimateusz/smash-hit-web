import './style.css';

import Game from './Game';
import AssetManager from './managers/AssetManager/AssetManager';
import MainScene from './scenes/MainScene';

const canvas = document.querySelector('#app') as HTMLCanvasElement;

AssetManager.instance.preload().then(() => {
  new Game(canvas, MainScene);
});