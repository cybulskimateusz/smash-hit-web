/* eslint-disable max-lines */
import './style.css';

import App from '@src/App/App';
import { getExposedProperties, resolveTarget } from '@testable/index';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { FbnBackground } from './FbnBackground/FbnBackground';

// import all ts files
import.meta.glob('@src/**/*.testable.ts', { eager: true });

const canvas = document.querySelector('#app') as HTMLCanvasElement;
const pathname = window.location.pathname;

const testablesLibrary = new GUI().addFolder('Testables library');
const testablesSorted = window.testableRegistry.sort((a, b) => a.params.path.localeCompare(b.params.path));

testablesSorted.forEach((testable) => {

  testablesLibrary.add(
    { openLink: () => window.location.pathname = testable.params.path },
    'openLink',
  ).name(testable.params.path);

});

const testable = window.testableRegistry.find(t => t.params.path === pathname);
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
const app = new App(canvas);

if (testable.params.useOrbitControls) {
  const controls = new OrbitControls(app.camera, app.renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();
}

if (testable.params.useFbnBackground) {
  const background = new FbnBackground();
  background.position.set(0, 0, -1);
  app.scene.add(background);
}

const component = new testable.controller(app);
app.scene.add(component);

const exposed = getExposedProperties(component);
if (exposed.length > 0) {
  const gui = new GUI();
  const folders = new Map<string, GUI>();

  for (const prop of exposed) {
    const folderName = prop.options.folder;
    const guiTarget = folderName
      ? (folders.get(folderName) ?? folders.set(folderName, gui.addFolder(folderName)).get(folderName)!)
      : gui;

    const { obj, key } = prop.options.target
      ? resolveTarget(component, prop.options.target)
      : { obj: component, key: prop.key };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controller = guiTarget.add(obj as any, key);
    if (prop.options.min !== undefined) controller.min(prop.options.min);
    if (prop.options.max !== undefined) controller.max(prop.options.max);
    if (prop.options.step !== undefined) controller.step(prop.options.step);
  }
}
