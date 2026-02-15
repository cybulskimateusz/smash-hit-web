import PermissionManager from './singletons/PermissionManager';
import RoutingManager from './singletons/RoutingManager';

class Mobile {
  constructor() {
    if (PermissionManager.isRequired) RoutingManager.instance.route('permissions');
    else RoutingManager.instance.route('loading');
  }
}

export default new Mobile();