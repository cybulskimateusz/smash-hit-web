import './style.css';

import Game from './Game';
import MainScene from './scenes/MainScene';

const canvas = document.querySelector('#app') as HTMLCanvasElement;
new Game(canvas, MainScene);