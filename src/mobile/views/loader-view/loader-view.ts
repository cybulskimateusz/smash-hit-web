import MobileNetworkManager from '@mobile/singletons/NetworkManager';
import Loader from '@src/shared-components/loader/loader';

interface LoaderViewProps {
  onConnected: () => void;
}

export default class LoaderView extends Loader {
  constructor(private props: LoaderViewProps) {
    super();

    MobileNetworkManager.instance.onOpen(() => {
      this.props.onConnected();
    });
  }
}
