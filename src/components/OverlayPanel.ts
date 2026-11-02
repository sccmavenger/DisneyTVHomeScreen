import type { MenuCard, MenuSection } from '../data/menu';
import type { NavAction, NavState } from '../state/navigation';
import { brandLogos } from '../ui/brandLogos';
import { el, svgIcon } from '../ui/dom';
import { icons } from '../ui/icons';

function createCard(card: MenuCard, index: number, dispatch: (action: NavAction) => void) {
  const button = el('button', 'card');
  button.type = 'button';
  if (card.action.kind === 'close') button.classList.add('card--close');
  const logo = brandLogos[card.id];
  if (card.icon) {
    button.appendChild(svgIcon(icons[card.icon], 'card__icon'));
  } else if (logo) {
    button.classList.add('card--logo');
    const img = el('img', 'card__logo');
    img.src = logo;
    img.alt = '';
    button.appendChild(img);
  } else {
    button.classList.add('card--wordmark');
  }
  // With a logo the wordmark is the label; keep the text for screen readers only.
  button.appendChild(el('span', logo && !card.icon ? 'card__label visually-hidden' : 'card__label', card.label));
  button.addEventListener('mouseenter', () => dispatch({ type: 'focusCard', index }));
  button.addEventListener('click', () => dispatch({ type: 'activateCard', index }));
  return button;
}

/** Floating espresso/gold panel. The scenic hero stays visible around it. */
export function createOverlayPanel(sections: readonly MenuSection[], dispatch: (action: NavAction) => void) {
  const layer = el('div', 'overlay');
  const panel = el('section', 'panel');
  panel.setAttribute('role', 'dialog');
  layer.appendChild(panel);
  // Clicking the scenery around the panel behaves like Back.
  layer.addEventListener('click', (event) => {
    if (event.target === layer) dispatch({ type: 'back' });
  });

  let rendered: number | null = null;
  let cards: HTMLButtonElement[] = [];

  function build(section: MenuSection) {
    panel.innerHTML = '';
    panel.className = `panel panel--${section.id}${section.placeholder ? ' panel--placeholder' : ''}`;
    const heading = el('h2', 'panel__heading', section.heading);
    heading.id = 'panel-heading';
    panel.setAttribute('aria-labelledby', heading.id);
    panel.appendChild(heading);
    panel.appendChild(el('p', 'panel__subtitle', section.subtitle));
    if (section.note) panel.appendChild(el('p', 'panel__note', section.note));

    const row = el('div', `panel__cards panel__cards--${section.cards.length}`);
    cards = section.cards.map((card, index) => createCard(card, index, dispatch));
    cards.forEach((card) => row.appendChild(card));
    panel.appendChild(row);
  }

  return {
    el: layer,
    update(state: NavState) {
      if (state.overlay !== rendered) {
        // Content is kept after closing so the fade-out shows the same panel.
        if (state.overlay !== null) build(sections[state.overlay]);
        rendered = state.overlay;
      }
      const open = state.overlay !== null;
      layer.classList.toggle('is-open', open);
      layer.setAttribute('aria-hidden', String(!open));
      cards.forEach((card, index) => card.classList.toggle('is-focused', open && index === state.cardIndex));
    },
    focusTarget(state: NavState): HTMLElement | undefined {
      return cards[state.cardIndex];
    },
  };
}
