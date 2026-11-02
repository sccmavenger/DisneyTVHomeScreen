import { describe, expect, it } from 'vitest';
import { keyToAction, WEBOS_BACK_KEYCODE } from './keys';

describe('keyToAction', () => {
  it('maps desktop arrow keys, Enter and Escape', () => {
    expect(keyToAction({ key: 'ArrowLeft' })).toEqual({ type: 'move', dir: 'left' });
    expect(keyToAction({ key: 'ArrowRight' })).toEqual({ type: 'move', dir: 'right' });
    expect(keyToAction({ key: 'ArrowUp' })).toEqual({ type: 'move', dir: 'up' });
    expect(keyToAction({ key: 'ArrowDown' })).toEqual({ type: 'move', dir: 'down' });
    expect(keyToAction({ key: 'Enter' })).toEqual({ type: 'select' });
    expect(keyToAction({ key: 'Escape' })).toEqual({ type: 'back' });
    expect(keyToAction({ key: 'Backspace' })).toEqual({ type: 'back' });
  });

  it('maps LG remote key codes, including Back (461)', () => {
    expect(keyToAction({ keyCode: 37 })).toEqual({ type: 'move', dir: 'left' });
    expect(keyToAction({ keyCode: 39 })).toEqual({ type: 'move', dir: 'right' });
    expect(keyToAction({ keyCode: 13 })).toEqual({ type: 'select' });
    expect(keyToAction({ keyCode: WEBOS_BACK_KEYCODE, key: 'Unidentified' })).toEqual({ type: 'back' });
  });

  it('ignores unrelated keys', () => {
    expect(keyToAction({ key: 'a', keyCode: 65 })).toBeNull();
    expect(keyToAction({})).toBeNull();
  });
});
