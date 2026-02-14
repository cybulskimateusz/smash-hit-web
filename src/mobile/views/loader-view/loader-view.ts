import Loader from '@src/shared-components/loader/loader';
import NetworkManager from '@src/singletons/NetworkManager/NetworkManager';

interface LoaderViewProps {
  onConnected: () => void;
}

export default class LoaderView extends Loader {
  constructor(private props: LoaderViewProps) {
    super();

    NetworkManager.instance.onOpen(() => {
      this.props.onConnected();
    });
  }
}
