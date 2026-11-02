import type { AppConfig } from '../config';
import { el } from '../ui/dom';

export function createTopHeader(config: AppConfig) {
  const header = el('header', 'top-header');
  header.appendChild(el('span', 'top-header__title', config.resortTitle));
  const view = el('span', 'top-header__view', config.viewLabel);
  header.appendChild(view);

  return {
    el: header,
    /** Resort Views will update this label later without reloading the app. */
    setViewLabel(label: string) {
      view.textContent = label;
    },
  };
}
