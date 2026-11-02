import type { PlatformAdapter } from '../../src/platform/types';
import { launchTargets } from './targets';
import { isWebOS, webOSLaunchBridge } from './webos';

/** LG webOS TVs, installed through Developer Mode. */
export const platform: PlatformAdapter = {
  id: 'lg',
  isDevice: isWebOS,
  launchBridge: webOSLaunchBridge,
  launchTargets,
};
