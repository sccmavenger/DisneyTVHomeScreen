import type { LaunchTargetId } from '../data/menu';
import type { AppLaunchBridge } from './launcher';

export interface LaunchTargetConfig {
  label: string;
  /**
   * The TV brand's app ID. Leave null until the ID has been confirmed on the
   * family's TV. Never fill one in from an internet list without testing it.
   */
  appId: string | null;
  /** Where and when appId was confirmed. Required whenever appId is set. */
  verifiedOn?: string;
}

/**
 * Everything brand-specific lives behind this interface, one implementation per
 * folder in platforms/ (selected at build time with PLATFORM=lg, vizio, ...).
 * The shared UI in src/ never knows which TV it is running on.
 */
export interface PlatformAdapter {
  /** Folder name in platforms/. */
  id: string;
  /** True when running on the real TV (false in a desktop browser). */
  isDevice(): boolean;
  /** Opens an installed TV app by ID. Omit when the platform cannot launch apps. */
  launchBridge?: AppLaunchBridge;
  launchTargets: Record<LaunchTargetId, LaunchTargetConfig>;
}
