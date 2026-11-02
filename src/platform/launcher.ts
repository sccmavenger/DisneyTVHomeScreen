import type { LaunchTargetId } from '../data/menu';
import type { Notice } from '../state/navigation';
import type { LaunchTargetConfig } from './types';

export type LaunchMode = 'browserDemo' | 'device';

export type LaunchStatus = 'launched' | 'demo' | 'not-configured' | 'failed';

export interface LaunchResult {
  status: LaunchStatus;
  /** Message to show the family, or null when the TV has handed off to the app. */
  notice: Notice | null;
}

/** Asks the TV to open an installed app. Resolves on success, rejects with a readable error. */
export type AppLaunchBridge = (appId: string) => Promise<void>;

export interface LauncherOptions {
  mode: LaunchMode;
  targets: Partial<Record<LaunchTargetId, LaunchTargetConfig>>;
  bridge?: AppLaunchBridge;
}

const UNAVAILABLE = 'App unavailable or not configured';

/**
 * The only layer that knows about native app IDs. Every failure path returns a
 * notice instead of throwing, so the launcher UI is never left broken.
 */
export function createLauncher(options: LauncherOptions) {
  const { mode, targets, bridge } = options;

  return async function launchTarget(targetId: LaunchTargetId): Promise<LaunchResult> {
    const target = targets[targetId];
    if (!target) {
      return { status: 'failed', notice: { title: UNAVAILABLE, message: 'This option is not set up yet.' } };
    }

    if (!target.appId) {
      return {
        status: 'not-configured',
        notice: {
          title: UNAVAILABLE,
          message: `${target.label} is not configured on this TV yet.`,
          detail: mode === 'browserDemo' ? 'Browser demo: TV apps cannot be opened from a desktop browser.' : undefined,
        },
      };
    }

    if (mode === 'browserDemo') {
      return {
        status: 'demo',
        notice: { title: 'Browser demo', message: `On the TV, this would open ${target.label}.` },
      };
    }

    if (!bridge) {
      return {
        status: 'failed',
        notice: { title: UNAVAILABLE, message: 'TV system services are not available to this app.' },
      };
    }

    try {
      await bridge(target.appId);
      return { status: 'launched', notice: null };
    } catch (error) {
      return {
        status: 'failed',
        notice: {
          title: UNAVAILABLE,
          message: `${target.label} could not be opened.`,
          detail: error instanceof Error ? error.message : undefined,
        },
      };
    }
  };
}
