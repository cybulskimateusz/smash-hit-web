import './permission-view.scss';

import View from '@src/abstracts/View';
import COPY from '@src/COPY';
import PermissionManager from '@src/mobile/singletons/PermissionManager';
import autoBind from 'auto-bind';

interface PermissionViewProps {
    onAllowed: () => void;
}

export default class PermissionView extends View {
  protected _view = View.createElement('section', { className: 'permission-view' });

  private heading = View.createElement('h1', {
    className: 'permission-view__heading',
    innerText: COPY.INSTRUCTION_PERMISSION
  });
  private acceptButton = View.createElement('button', {
    className: 'base-button',
    ariaLabel: COPY.BUTTON_REQUEST_PERMISSON,
    innerText: COPY.BUTTON_REQUEST_PERMISSON,
    type: 'button'
  });

  constructor(private props: PermissionViewProps) {
    super();
    autoBind(this);

    this.acceptButton.onclick = this.onAcceptButtonClick;
    this.view.appendChild(this.heading);
    this.view.appendChild(this.acceptButton);
  }

  private onAcceptButtonClick = () => {
    PermissionManager.instance
      .request()
      .then(isAllowed => {
        if (!isAllowed) return;
        this.props.onAllowed();
      });
  };
}