import type { IconName } from '../data/menu';
import type { WeatherKind } from '../services/weather';

const CLOUD = '<path d="M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.1 10 4.25 4.25 0 0 0 7 18.5z"/>';
const SMALL_CLOUD = '<path d="M7 16h9a3.2 3.2 0 0 0 .4-6.37A4.6 4.6 0 0 0 7.6 8.7 3.65 3.65 0 0 0 7 16z"/>';

/** Weather condition icons (day variants; clear/partly have night variants below). */
export const weatherIcons: Record<WeatherKind, string> & { clearNight: string; partlyNight: string } = {
  clear:
    '<circle cx="12" cy="12" r="4.5"/>' +
    '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  clearNight: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  partly:
    '<path d="M8.5 3v1.5M3.6 5.1l1 1M2 9.5h1.5M12.4 6.1l1-1"/><path d="M5.6 11.6A3.5 3.5 0 0 1 11.7 8"/>' +
    '<path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 9.1 12.5 3.75 3.75 0 0 0 9 20z"/>',
  partlyNight:
    '<path d="M11 7.5A5 5 0 0 1 4.5 2.9a5 5 0 1 0 6.5 4.6z"/>' +
    '<path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 9.1 12.5 3.75 3.75 0 0 0 9 20z"/>',
  cloudy: CLOUD,
  fog: '<path d="M4 9h16M2.5 13h19M4 17h16M7 21h10"/>',
  rain: SMALL_CLOUD + '<path d="M8 19l-1 2.5M12 19l-1 2.5M16 19l-1 2.5"/>',
  snow: SMALL_CLOUD + '<path d="M8 19.5h.01M12 21h.01M16 19.5h.01M10 22.5h.01M14 22.5h.01"/>',
  storm: SMALL_CLOUD + '<path d="M12.5 16.5l-2 3.5h3l-2 3.5"/>',
};

/** Original line icons on a 24×24 grid, drawn with currentColor. */
export const icons: Record<IconName | 'sun', string> = {
  tv: '<rect x="2.5" y="4.5" width="19" height="13" rx="2"/><path d="M8 21h8M12 17.5V21"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  gamepad:
    '<path d="M6.5 8.5h11a4 4 0 0 1 4 4v1.2a2.8 2.8 0 0 1-5 1.7L15 13.5H9l-1.5 1.9a2.8 2.8 0 0 1-5-1.7v-1.2a4 4 0 0 1 4-4z"/>' +
    '<path d="M7 10.5v3M5.5 12h3"/><path d="M15.5 11h.01M17.5 13h.01"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
  sunset:
    '<path d="M3 18h18M6 21h12"/><path d="M7.5 18a4.5 4.5 0 0 1 9 0"/>' +
    '<path d="M12 6v3M5.3 9.3l1.8 1.8M18.7 9.3l-1.8 1.8M2.5 14.5H5M19 14.5h2.5"/>',
  antenna: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M8 3l4 6 4-6"/>',
  channels:
    '<rect x="3" y="4" width="8" height="7" rx="1.2"/><rect x="13" y="4" width="8" height="7" rx="1.2"/>' +
    '<rect x="3" y="13" width="8" height="7" rx="1.2"/><rect x="13" y="13" width="8" height="7" rx="1.2"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
  sun:
    '<circle cx="12" cy="12" r="4.5"/>' +
    '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
};
