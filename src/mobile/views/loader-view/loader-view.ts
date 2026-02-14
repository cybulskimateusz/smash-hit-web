import './loader-view.scss';

import View from '@src/abstracts/View';
import NetworkManager from '@src/singletons/NetworkManager/NetworkManager';

interface LoaderViewProps {
  onConnected: () => void;
}

export default class LoaderView extends View {
  protected _view = View.createElement('section', { className: 'loader-view' });

  private dots = View.createElement('div', { className: 'loader-view__dots' });

  constructor(private props: LoaderViewProps) {
    super();

    for (let i = 0; i < 3; i++) {
      this.dots.appendChild(View.createElement('span', { className: 'loader-view__dot' }));
    }

    this._view.appendChild(this.dots);

    NetworkManager.instance.onOpen(() => {
      this.props.onConnected();
    });
  }
}
