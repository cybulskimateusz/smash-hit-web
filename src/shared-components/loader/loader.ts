import './loader.scss';

import View from '@src/abstracts/View';

export default class Loader extends View {
  protected _view = View.createElement('div', { className: 'loader' });

  constructor() {
    super();

    const dots = View.createElement('div', { className: 'loader__dots' });

    for (let i = 0; i < 3; i++) {
      dots.appendChild(View.createElement('span', { className: 'loader__dot' }));
    }

    this._view.appendChild(dots);
  }
}
