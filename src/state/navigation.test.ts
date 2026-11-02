import { describe, expect, it } from 'vitest';
import { sections } from '../data/menu';
import { initialState, reduce, type NavAction, type NavState } from './navigation';

const WATCH_TV = 0;
const STREAMING = 1;
const GAMING = 2;

function run(actions: NavAction[], start: NavState = initialState) {
  let state = start;
  let effect = null as ReturnType<typeof reduce>['effect'];
  for (const action of actions) {
    const result = reduce(state, action, sections);
    state = result.state;
    effect = result.effect;
  }
  return { state, effect };
}

const right: NavAction = { type: 'move', dir: 'right' };
const left: NavAction = { type: 'move', dir: 'left' };
const select: NavAction = { type: 'select' };
const back: NavAction = { type: 'back' };

describe('home dock', () => {
  it('focuses Watch TV on first launch with no overlay', () => {
    expect(initialState).toEqual({ dockIndex: WATCH_TV, overlay: null, cardIndex: 0, notice: null });
  });

  it('lets every dock item receive focus and clamps at both ends', () => {
    const visited: number[] = [];
    let state = initialState;
    for (let i = 0; i < sections.length + 2; i++) {
      visited.push(state.dockIndex);
      state = reduce(state, right, sections).state;
    }
    expect(visited).toEqual([0, 1, 2, 3, 4, 4, 4]);
    expect(run([left, left], state).state.dockIndex).toBe(2);
    expect(run([left], initialState).state.dockIndex).toBe(0);
  });

  it('ignores up/down without losing focus', () => {
    const start = run([right]).state;
    expect(run([{ type: 'move', dir: 'up' }, { type: 'move', dir: 'down' }], start).state).toEqual(start);
  });

  it('back on Home does nothing', () => {
    expect(run([back]).state).toEqual(initialState);
  });
});

describe('overlays', () => {
  it('opens Watch TV with Live TV focused', () => {
    const { state } = run([select]);
    expect(state.overlay).toBe(WATCH_TV);
    expect(sections[WATCH_TV].cards[state.cardIndex].label).toBe('Live TV');
  });

  it('opens Streaming with Plex focused', () => {
    const { state } = run([right, select]);
    expect(state.overlay).toBe(STREAMING);
    expect(sections[STREAMING].cards[state.cardIndex].label).toBe('Plex');
  });

  it('moves among cards and clamps at the ends', () => {
    expect(run([right, select, right, right, right, right, right]).state.cardIndex).toBe(3);
    expect(run([select, right, right, right, right]).state.cardIndex).toBe(2);
    expect(run([select, left]).state.cardIndex).toBe(0);
  });

  it('does not move the dock while an overlay is open', () => {
    const { state } = run([right, select, right]);
    expect(state.dockIndex).toBe(STREAMING);
  });

  it('back closes the overlay and restores focus to the dock item that opened it', () => {
    const { state } = run([right, select, right, right, back]);
    expect(state).toEqual({ dockIndex: STREAMING, overlay: null, cardIndex: 0, notice: null });
  });

  it('re-opening an overlay starts on the first card again', () => {
    expect(run([right, select, right, right, back, select]).state.cardIndex).toBe(0);
  });

  it('placeholder sections open with a focused Back to Home card that closes them', () => {
    const opened = run([right, right, select]).state;
    expect(opened.overlay).toBe(GAMING);
    expect(sections[GAMING].cards[opened.cardIndex].action.kind).toBe('close');
    const closed = run([select], opened).state;
    expect(closed.overlay).toBeNull();
    expect(closed.dockIndex).toBe(GAMING);
  });
});

describe('card activation', () => {
  it('emits a launch effect for Live TV', () => {
    expect(run([select, select]).effect).toEqual({ type: 'launch', targetId: 'liveTv' });
  });

  it('emits launch effects for each streaming app in order', () => {
    const ids = [0, 1, 2, 3].map((n) => {
      const moves: NavAction[] = Array.from({ length: n }, () => right);
      return run([right, select, ...moves, select]).effect?.targetId;
    });
    expect(ids).toEqual(['plex', 'hulu', 'peacock', 'netflix']);
  });

  it('Favorites shows the V1 placeholder message instead of launching', () => {
    const { state, effect } = run([select, right, right, select]);
    expect(effect).toBeNull();
    expect(state.notice?.message).toBe('Favorites will be available after TV setup.');
  });
});

describe('notice dialog', () => {
  const withNotice = run([right, select, { type: 'showNotice', notice: { title: 't', message: 'm' } }]).state;

  it('captures arrows so focus stays on the dismiss button', () => {
    expect(run([right, left], withNotice).state).toEqual(withNotice);
  });

  it('does not launch while a notice is open', () => {
    const result = reduce(withNotice, select, sections);
    expect(result.effect).toBeNull();
    expect(result.state.notice).toBeNull();
  });

  it('back dismisses the notice but keeps the overlay and focused card', () => {
    const { state } = run([back], withNotice);
    expect(state.notice).toBeNull();
    expect(state.overlay).toBe(STREAMING);
    expect(state.cardIndex).toBe(withNotice.cardIndex);
  });
});

describe('pointer input', () => {
  it('hovering focuses dock items and cards, ignoring out-of-range indexes', () => {
    expect(run([{ type: 'focusDock', index: 3 }]).state.dockIndex).toBe(3);
    expect(run([{ type: 'focusDock', index: 99 }]).state.dockIndex).toBe(0);
    expect(run([select, { type: 'focusCard', index: 2 }]).state.cardIndex).toBe(2);
    expect(run([select, { type: 'focusCard', index: 9 }]).state.cardIndex).toBe(0);
  });

  it('clicking a dock item opens that overlay, even while another is open', () => {
    const { state } = run([select, { type: 'activateDock', index: STREAMING }]);
    expect(state).toMatchObject({ overlay: STREAMING, dockIndex: STREAMING, cardIndex: 0 });
  });

  it('clicking a card activates it', () => {
    expect(run([right, select, { type: 'activateCard', index: 3 }]).effect).toEqual({
      type: 'launch',
      targetId: 'netflix',
    });
  });
});
