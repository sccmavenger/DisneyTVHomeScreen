import { describe, expect, it } from 'vitest';
import { sections } from '../../src/data/menu';
import { launchTargets } from './targets';

describe('LG launch targets', () => {
  it('every launch card points at a known launch target', () => {
    for (const section of sections) {
      for (const card of section.cards) {
        if (card.action.kind === 'launch') expect(launchTargets[card.action.targetId]).toBeDefined();
      }
    }
  });

  it('ships with no unverified app IDs', () => {
    for (const target of Object.values(launchTargets)) {
      if (target.appId !== null) expect(target.verifiedOn).toBeTruthy();
    }
  });
});
