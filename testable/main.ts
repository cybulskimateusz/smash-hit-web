import './style.css';

import Game from '@desktop/Game';
import { registerTestables } from '@testable/index';
import { GUI } from 'dat.gui';

// import all testable files and register them
const testableModules = import.meta.glob('@src/**/*.testable.ts', { eager: true });
registerTestables(testableModules);

const canvas = document.querySelector('#app') as HTMLCanvasElement;
const pathname = window.location.pathname;

const testablesLibrary = new GUI().addFolder('Testables library');
const testablesSorted = window.testableRegistry.sort((a, b) => a.path.localeCompare(b.path));

testablesSorted.forEach((testable) => {
  testablesLibrary.add(
    { openLink: () => window.location.pathname = testable.path },
    'openLink',
  ).name(testable.path);
});

const testable = window.testableRegistry.find(t => t.path === pathname);
const titleElement = document.querySelector('title');

if (!testable) {
      titleElement!.textContent = 'Testable: Not Found';
      canvas.style.display = 'none';
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<h1 class="errorMessage">Testable component not found for path: ${pathname}</h1>`
      );
      throw new Error(`Testable component not found for path: ${pathname}`);
}

titleElement!.textContent = `Testable: ${pathname}`;
new Game(canvas, testable.controller);