import type { NavAction } from '../state/navigation';

/** LG remote Back button. */
export const WEBOS_BACK_KEYCODE = 461;

const BY_KEY: Record<string, NavAction> = {
  ArrowLeft: { type: 'move', dir: 'left' },
  Left: { type: 'move', dir: 'left' },
  ArrowRight: { type: 'move', dir: 'right' },
  Right: { type: 'move', dir: 'right' },
  ArrowUp: { type: 'move', dir: 'up' },
  Up: { type: 'move', dir: 'up' },
  ArrowDown: { type: 'move', dir: 'down' },
  Down: { type: 'move', dir: 'down' },
  Enter: { type: 'select' },
  Escape: { type: 'back' },
  Esc: { type: 'back' },
  Backspace: { type: 'back' },
  GoBack: { type: 'back' },
  BrowserBack: { type: 'back' },
};

const BY_KEYCODE: Record<number, NavAction> = {
  37: { type: 'move', dir: 'left' },
  38: { type: 'move', dir: 'up' },
  39: { type: 'move', dir: 'right' },
  40: { type: 'move', dir: 'down' },
  13: { type: 'select' },
  27: { type: 'back' },
  8: { type: 'back' },
  [WEBOS_BACK_KEYCODE]: { type: 'back' },
};

/** Maps a keyboard / TV remote event to a navigation action, or null if unhandled. */
export function keyToAction(event: { key?: string; keyCode?: number }): NavAction | null {
  if (event.keyCode !== undefined && BY_KEYCODE[event.keyCode]) return BY_KEYCODE[event.keyCode];
  if (event.key && BY_KEY[event.key]) return BY_KEY[event.key];
  return null;
}
