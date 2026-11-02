import type { MenuSection } from '../data/menu';
import type { NavAction, NavState } from '../state/navigation';
import { el, svgIcon } from '../ui/dom';
import { icons } from '../ui/icons';

export function createBottomDock(sections: readonly MenuSection[], dispatch: (action: NavAction) => void) {
  const nav = el('nav', 'dock');
  nav.setAttribute('aria-label', 'Main menu');
  const row = el('div', 'dock__items');

  const items = sections.map((section, index) => {
    const button = el('button', 'dock__item');
    button.type = 'button';
    const inner = el('span', 'dock__inner');
    inner.appendChild(svgIcon(icons[section.icon], 'dock__icon'));
    inner.appendChild(el('span', 'dock__label', section.label));
    button.appendChild(inner);
    button.addEventListener('mouseenter', () => dispatch({ type: 'focusDock', index }));
    button.addEventListener('click', () => dispatch({ type: 'activateDock', index }));
    row.appendChild(button);
    return button;
  });
  nav.appendChild(row);

  return {
    el: nav,
    update(state: NavState) {
      items.forEach((item, index) => {
        item.classList.toggle('is-focused', state.overlay === null && index === state.dockIndex);
        item.classList.toggle('is-active', state.overlay === index);
      });
    },
    focusTarget(state: NavState): HTMLElement | undefined {
      return items[state.dockIndex];
    },
  };
}
