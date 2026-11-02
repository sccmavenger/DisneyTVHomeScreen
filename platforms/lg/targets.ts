import type { LaunchTargetId } from '../../src/data/menu';
import type { LaunchTargetConfig } from '../../src/platform/types';

/** webOS app IDs, each confirmed by launching it on the family's TV (see README.md). */
const FAMILY_TV = '86UN9070AUD, webOS 5.6.2, 2026-11-01';

export const launchTargets: Record<LaunchTargetId, LaunchTargetConfig> = {
  liveTv: { label: 'Live TV', appId: 'com.webos.app.livetv', verifiedOn: FAMILY_TV },
  // No standalone LG Channels app ID found on this TV (8 candidates returned "not exist").
  lgChannels: { label: 'LG Channels', appId: null },
  plex: { label: 'Plex', appId: 'cdp-30', verifiedOn: FAMILY_TV },
  hulu: { label: 'Hulu', appId: 'hulu', verifiedOn: FAMILY_TV },
  peacock: { label: 'Peacock', appId: 'com.peacock.tv', verifiedOn: FAMILY_TV },
  netflix: { label: 'Netflix', appId: 'netflix', verifiedOn: FAMILY_TV },
};
