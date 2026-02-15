import MobileNetworkManager from '@mobile/singletons/NetworkManager';
import RoutingManager from '@src/mobile/singletons/RoutingManager';
import Loader from '@src/shared-components/loader/loader';

export default class LoaderView extends Loader {
  constructor() {
    super();

    MobileNetworkManager.instance.onOpen(() => {
      RoutingManager.instance.route('register');
    });
  }
}
