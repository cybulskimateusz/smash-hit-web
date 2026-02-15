import View from '../abstracts/View';
import RoomManager from '../singletons/NetworkManager/RoomManager';
import PermissionManager from './singletons/PermissionManager';
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
    const nextViewFactory = this.viewFactories[this.currentViewIndex + 1];

    if (!nextViewFactory || !currentView) return;

    const nextView = nextViewFactory();
    this.views[this.currentViewIndex + 1] = nextView;

    currentView.view.remove();
    this.app.appendChild(nextView.view);

    this.currentViewIndex++;
  };

  private viewFactories: (() => View)[] = RoomManager.instance.roomID
    ? [
      ...(PermissionManager.isRequired
        ? [() => new PermissionView({ onAllowed: this.switchView }) as View]
        : []),
      () => new LoaderView({ onConnected: this.switchView }),
      () => new RegistrationView({ onAccept: this.switchView }),
      () => new GameView()
    ]
    : [() => new ErrorView()];

  private views: (View | undefined)[] = [];

  constructor() {
    const firstView = this.viewFactories[0]();
    this.views[0] = firstView;
    this.app.appendChild(firstView.view);
  }
}

export default new Mobile();