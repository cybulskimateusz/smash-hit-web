import isMobile from './utils/isMobile';

if (isMobile()) import('@mobile/index').then(module => module.default);
else import('@desktop/index').then(module => module.default);
