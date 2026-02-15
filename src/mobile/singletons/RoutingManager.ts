import type View from '@src/abstracts/View';
import autoBind from 'auto-bind';

const ROUTES = {
  error: () => import('@mobile/views/error-view/error-view'),
  game: () => import('@mobile/views/game-view/game-view'),
  loading: () => import('@mobile/views/loader-view/loader-view'),
  permissions: () => import('@mobile/views/permission-view/permission-view'),
  register: () => import('@mobile/views/registration-view/registration-view'),
};

class RoutingManager {
  private app: HTMLElement = document.querySelector('#app')!;
  static instance = new RoutingManager();

  private currentView?: View;

  constructor() {
    autoBind(this);
  }

  public async route(to: keyof typeof ROUTES) {
    const { default: ViewClass } = await ROUTES[to]();
    this.currentView?.view.remove();
    this.currentView = new ViewClass();
    this.app.appendChild(this.currentView.view);
  }
}

export default RoutingManager;
