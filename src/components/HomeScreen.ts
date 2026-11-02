import type { AppConfig } from '../config';
import type { MenuSection } from '../data/menu';
import type { NavAction, NavState } from '../state/navigation';
import { el, focusElement } from '../ui/dom';
import { createBottomDock } from './BottomDock';
import { createNoticeDialog } from './NoticeDialog';
import { createOverlayPanel } from './OverlayPanel';
import { createScenicHero } from './ScenicHero';
import { createTopHeader } from './TopHeader';
import { createWelcomeBar } from './WelcomeBar';

export interface HomeScreenOptions {
  sections: readonly MenuSection[];
  config: AppConfig;
  dispatch: (action: NavAction) => void;
}

/** Builds the DOM once; state changes only toggle classes and move focus. */
export function createHomeScreen({ sections, config, dispatch }: HomeScreenOptions) {
  const stage = el('div', 'stage');
  const header = createTopHeader(config);
  const welcome = createWelcomeBar(config);
  const hero = createScenicHero(config);
  const overlay = createOverlayPanel(sections, dispatch);
  const dock = createBottomDock(sections, dispatch);
  const notice = createNoticeDialog(dispatch);

  stage.appendChild(header.el);
  stage.appendChild(welcome.el);
  stage.appendChild(hero.el);
  stage.appendChild(overlay.el);
  stage.appendChild(dock.el);
  stage.appendChild(notice.el);

  return {
    el: stage,
    update(state: NavState) {
      dock.update(state);
      overlay.update(state);
      notice.update(state);
      focusElement(
        state.notice
          ? notice.focusTarget()
          : state.overlay !== null
            ? overlay.focusTarget(state)
            : dock.focusTarget(state),
      );
    },
  };
}
