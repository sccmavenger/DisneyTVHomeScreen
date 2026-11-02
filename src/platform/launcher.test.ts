import { describe, expect, it, vi } from 'vitest';
import { createLauncher } from './launcher';
import type { LaunchTargetConfig } from './types';

// Fixtures, independent of the real IDs verified on the family's TV.
const launchTargets: Record<'hulu' | 'liveTv' | 'plex', LaunchTargetConfig> = {
  hulu: { label: 'Hulu', appId: null },
  liveTv: { label: 'Live TV', appId: null },
  plex: { label: 'Plex', appId: null },
};
const configured = { ...launchTargets, plex: { label: 'Plex', appId: 'test.plex.id' } };

describe('launchTarget', () => {
  it('reports unconfigured targets gracefully in the browser demo', async () => {
    const launch = createLauncher({ mode: 'browserDemo', targets: launchTargets });
    const result = await launch('hulu');
    expect(result.status).toBe('not-configured');
    expect(result.notice?.title).toBe('App unavailable or not configured');
    expect(result.notice?.message).toBe('Hulu is not configured on this TV yet.');
    expect(result.notice?.detail).toMatch(/browser demo/i);
  });

  it('never calls the TV bridge for unconfigured targets on the TV', async () => {
    const bridge = vi.fn(() => Promise.resolve());
    const launch = createLauncher({ mode: 'device', targets: launchTargets, bridge });
    const result = await launch('liveTv');
    expect(result.status).toBe('not-configured');
    expect(result.notice?.detail).toBeUndefined();
    expect(bridge).not.toHaveBeenCalled();
  });

  it('only simulates configured launches in the browser demo', async () => {
    const bridge = vi.fn(() => Promise.resolve());
    const launch = createLauncher({ mode: 'browserDemo', targets: configured, bridge });
    const result = await launch('plex');
    expect(result.status).toBe('demo');
    expect(result.notice?.message).toBe('On the TV, this would open Plex.');
    expect(bridge).not.toHaveBeenCalled();
  });

  it('hands off to the TV with no notice when the launch succeeds', async () => {
    const bridge = vi.fn(() => Promise.resolve());
    const launch = createLauncher({ mode: 'device', targets: configured, bridge });
    expect(await launch('plex')).toEqual({ status: 'launched', notice: null });
    expect(bridge).toHaveBeenCalledWith('test.plex.id');
  });

  it('turns bridge failures into a friendly notice instead of throwing', async () => {
    const bridge = vi.fn(() => Promise.reject(new Error('Application not found')));
    const launch = createLauncher({ mode: 'device', targets: configured, bridge });
    const result = await launch('plex');
    expect(result.status).toBe('failed');
    expect(result.notice?.message).toBe('Plex could not be opened.');
    expect(result.notice?.detail).toBe('Application not found');
  });

  it('handles a missing bridge and unknown targets', async () => {
    expect((await createLauncher({ mode: 'device', targets: configured })('plex')).status).toBe('failed');
    expect((await createLauncher({ mode: 'device', targets: {} })('hulu')).status).toBe('failed');
  });
});
