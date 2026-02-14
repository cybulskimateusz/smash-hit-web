import type View from '../abstracts/View';
import RoomManager from '../singletons/NetworkManager/RoomManager';
import ErrorView from './views/error-view/error-view';
import GameView from './views/game-view/game-view';
import LoaderView from './views/loader-view/loader-view';
import PermissionView from './views/permission-view/permission-view';
import RegistrationView from './views/registration-view/registration-view';

class Mobile {
  private app: HTMLElement = document.querySelector('#app')!;

  private currentViewIndex = 0;

  private switchView = () => {
    const currentView = this.views[this.currentViewIndex];
    const nextView = this.views[this.currentViewIndex + 1];

    if (!nextView || !currentView) return;

    currentView.view.remove();
    this.app.appendChild(nextView.view);

    this.currentViewIndex++;
  };

  private views: View[] = RoomManager.instance.roomID
    ? [
      new PermissionView({ onAllowed: this.switchView }),
      new LoaderView({ onConnected: this.switchView }),
      new RegistrationView({ onAccept: this.switchView }),
      new GameView()
    ]
    : [new ErrorView()];

  constructor() {
    this.app.appendChild(this.views[0].view);
  }
}

export default new Mobile();