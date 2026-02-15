import ErrorView from '@mobile/views/error-view/error-view';
import GameView from '@mobile/views/game-view/game-view';
import LoaderView from '@mobile/views/loader-view/loader-view';
import PermissionView from '@mobile/views/permission-view/permission-view';
import RegistrationView from '@mobile/views/registration-view/registration-view';
import type View from '@src/abstracts/View';
import autoBind from 'auto-bind';

const ROUTES = {
  error: ErrorView,
  game: GameView,
  loading: LoaderView,
  permissions: PermissionView,
  register: RegistrationView,
};

class RoutingManager {
  private app: HTMLElement = document.querySelector('#app')!;
  static instance = new RoutingManager();

  private currentView?: View;

  constructor() {
    autoBind(this);
  }

  public route(to: keyof typeof ROUTES) {
    this.currentView?.view.remove();
    this.currentView = new ROUTES[to]();
    this.app.appendChild(this.currentView.view);
  }
}

export default RoutingManager;
