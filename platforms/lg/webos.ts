import type { AppLaunchBridge } from '../../src/platform/launcher';

interface WebOSServiceRequestParams {
  method: string;
  parameters: Record<string, unknown>;
  onSuccess?: (response: unknown) => void;
  onFailure?: (error: { errorCode?: number; errorText?: string }) => void;
}

/** Built into the webOS web runtime; webOSTV.js is a thin wrapper around it. */
interface PalmServiceBridgeInstance {
  onservicecallback: ((message: string) => void) | null;
  call(uri: string, payload: string): void;
  cancel?(): void;
}

declare global {
  interface Window {
    PalmSystem?: unknown;
    webOSSystem?: unknown;
    /** Provided by LG's webOSTV.js library when it is bundled with the app. */
    webOS?: { service?: { request: (uri: string, params: WebOSServiceRequestParams) => unknown } };
    PalmServiceBridge?: new () => PalmServiceBridgeInstance;
  }
}

/** Keeps in-flight bridges referenced so they are not garbage-collected before replying. */
const activeBridges = new Set<PalmServiceBridgeInstance>();

function callWithPalmBridge(
  Bridge: new () => PalmServiceBridgeInstance,
  uri: string,
  params: Record<string, unknown>,
  onSuccess: () => void,
  onFailure: (errorText?: string) => void,
): void {
  const bridge = new Bridge();
  activeBridges.add(bridge);
  bridge.onservicecallback = (message) => {
    activeBridges.delete(bridge);
    let response: { returnValue?: boolean; errorText?: string } = {};
    try {
      response = JSON.parse(message);
    } catch {
      // Treat unreadable replies as failures below.
    }
    if (response.returnValue) onSuccess();
    else onFailure(response.errorText);
  };
  bridge.call(uri, JSON.stringify(params));
}

const LAUNCH_TIMEOUT_MS = 8000;

export function isWebOS(): boolean {
  return typeof window !== 'undefined' && Boolean(window.webOSSystem || window.PalmSystem);
}

/**
 * Launches an installed app through LG's Application Manager service.
 * UNVERIFIED: behavior depends on the TV model, firmware and app; test on device.
 * After a successful launch the other app takes over; returning here is not guaranteed.
 */
export const webOSLaunchBridge: AppLaunchBridge = (appId) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('The TV did not respond in time.')), LAUNCH_TIMEOUT_MS);
    const succeed = () => {
      clearTimeout(timer);
      resolve();
    };
    const fail = (errorText?: string) => {
      clearTimeout(timer);
      reject(new Error(errorText || 'The TV refused to open the app.'));
    };

    const service = window.webOS && window.webOS.service;
    if (service && typeof service.request === 'function') {
      service.request('luna://com.webos.applicationManager', {
        method: 'launch',
        parameters: { id: appId },
        onSuccess: succeed,
        onFailure: (error) => fail(error && error.errorText),
      });
      return;
    }

    if (typeof window.PalmServiceBridge === 'function') {
      callWithPalmBridge(
        window.PalmServiceBridge,
        'luna://com.webos.applicationManager/launch',
        { id: appId },
        succeed,
        fail,
      );
      return;
    }

    fail('TV system services are not available to this app.');
  });
