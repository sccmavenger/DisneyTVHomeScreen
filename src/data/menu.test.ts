import { describe, expect, it } from 'vitest';
import { sections } from './menu';

describe('approved menu', () => {
  it('has the five dock items in the approved order', () => {
    expect(sections.map((s) => s.label)).toEqual([
      'Watch TV',
      'Streaming',
      'Gaming & HDMI',
      'Family Photos',
      'Resort Views',
    ]);
  });

  it('Watch TV shows exactly Live TV / LG Channels / Favorites', () => {
    expect(sections[0].cards.map((c) => c.label)).toEqual(['Live TV', 'LG Channels', 'Favorites']);
  });

  it('Streaming shows exactly Plex / Hulu / Peacock / Netflix', () => {
    expect(sections[1].cards.map((c) => c.label)).toEqual(['Plex', 'Hulu', 'Peacock', 'Netflix']);
  });

  it('streaming tiles carry no generic icon (they show the app wordmark)', () => {
    expect(sections[1].cards.every((c) => c.icon === null)).toBe(true);
  });

  it('only Gaming, Photos and Views are placeholders, each with a way back', () => {
    expect(sections.filter((s) => s.placeholder).map((s) => s.id)).toEqual(['gaming', 'photos', 'views']);
    for (const section of sections.filter((s) => s.placeholder)) {
      expect(section.cards).toHaveLength(1);
      expect(section.cards[0].action.kind).toBe('close');
    }
  });

  it('every section has at least one focusable card', () => {
    expect(sections.every((s) => s.cards.length > 0)).toBe(true);
  });
});
