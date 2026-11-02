import type { AppConfig } from '../config';
import { el } from '../ui/dom';

/** Static scenic backdrop (no video or animation, to stay light on older TVs). */
export function createScenicHero(config: AppConfig) {
  const hero = el('div', 'hero');
  hero.setAttribute('role', 'img');
  hero.setAttribute('aria-label', 'Savanna at sunset');
  hero.appendChild(el('div', 'hero__ribbon', config.ribbonMessage));
  return { el: hero };
}
