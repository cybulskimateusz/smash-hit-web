import './style.css';

import loadDesktop from './loadDesktop';
import loadMobile from './loadMobile';
import isMobile from './utils/device/isMobile';

if (isMobile()) loadMobile();
else loadDesktop();
