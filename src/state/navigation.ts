import type { LaunchTargetId, MenuSection } from '../data/menu';

export interface Notice {
  title: string;
  message: string;
  detail?: string;
}

export interface NavState {
  /** Focused dock item. While an overlay is open this is the item that opened it. */
  dockIndex: number;
  /** Index of the open section overlay, or null when Home is showing. */
  overlay: number | null;
  /** Focused card inside the open overlay. */
  cardIndex: number;
  /** Dismissable message (launch failures, placeholders). Captures input while shown. */
  notice: Notice | null;
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export type NavAction =
  | { type: 'move'; dir: Direction }
  | { type: 'select' }
  | { type: 'back' }
  | { type: 'focusDock'; index: number }
  | { type: 'focusCard'; index: number }
  | { type: 'activateDock'; index: number }
  | { type: 'activateCard'; index: number }
  | { type: 'showNotice'; notice: Notice }
  | { type: 'dismissNotice' };

export interface LaunchEffect {
  type: 'launch';
  targetId: LaunchTargetId;
}

export interface NavResult {
  state: NavState;
  effect: LaunchEffect | null;
}

export const initialState: NavState = { dockIndex: 0, overlay: null, cardIndex: 0, notice: null };

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

const only = (state: NavState): NavResult => ({ state, effect: null });

function open(state: NavState, sections: readonly MenuSection[], index: number): NavResult {
  if (!sections[index]) return only(state);
  return only({ ...state, dockIndex: index, overlay: index, cardIndex: 0 });
}

function close(state: NavState): NavResult {
  if (state.overlay === null) return only(state);
  return only({ ...state, dockIndex: state.overlay, overlay: null, cardIndex: 0 });
}

function activateCard(state: NavState, sections: readonly MenuSection[], index: number): NavResult {
  if (state.overlay === null) return only(state);
  const card = sections[state.overlay].cards[index];
  if (!card) return only(state);
  const next = { ...state, cardIndex: index };
  switch (card.action.kind) {
    case 'launch':
      return { state: next, effect: { type: 'launch', targetId: card.action.targetId } };
    case 'info':
      return only({ ...next, notice: { title: card.action.title, message: card.action.message } });
    case 'close':
      return close(next);
  }
}

/**
 * Pure focus/overlay state machine shared by remote keys, desktop keyboard and
 * pointer input. Focus always lands on a valid element; nothing here can trap it.
 */
export function reduce(state: NavState, action: NavAction, sections: readonly MenuSection[]): NavResult {
  if (state.notice) {
    switch (action.type) {
      case 'select':
      case 'back':
      case 'dismissNotice':
        return only({ ...state, notice: null });
      case 'showNotice':
        return only({ ...state, notice: action.notice });
      default:
        return only(state);
    }
  }

  switch (action.type) {
    case 'move': {
      // Up/Down are accepted but keep focus where it is (every layout is a single row).
      const delta = action.dir === 'left' ? -1 : action.dir === 'right' ? 1 : 0;
      if (delta === 0) return only(state);
      if (state.overlay === null) {
        return only({ ...state, dockIndex: clamp(state.dockIndex + delta, sections.length - 1) });
      }
      const count = sections[state.overlay].cards.length;
      return only({ ...state, cardIndex: clamp(state.cardIndex + delta, count - 1) });
    }
    case 'select':
      return state.overlay === null
        ? open(state, sections, state.dockIndex)
        : activateCard(state, sections, state.cardIndex);
    case 'back':
      return close(state);
    case 'focusDock':
      if (state.overlay !== null || !sections[action.index]) return only(state);
      return only({ ...state, dockIndex: action.index });
    case 'focusCard':
      if (state.overlay === null || !sections[state.overlay].cards[action.index]) return only(state);
      return only({ ...state, cardIndex: action.index });
    case 'activateDock':
      return open(state, sections, action.index);
    case 'activateCard':
      return activateCard(state, sections, action.index);
    case 'showNotice':
      return only({ ...state, notice: action.notice });
    case 'dismissNotice':
      return only(state);
  }
}
