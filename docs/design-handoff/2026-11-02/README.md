# Guillory Resort — Approved Design Handoff (November 2, 2026)

For the next coding session with Claude (November 3, 2026). These visual concepts were approved by Danny on November 2, 2026 and are reference designs, not implemented screens.

## Reference images

- [Animal Kingdom home](animal-kingdom-home.png) — warm lodge / safari styling.
- [Cruise home with ship status](cruise-home-ship-status.png) — nautical theme with an interactive ship-tracking summary.
- [Cruise settings and ship selection](cruise-theme-settings.png) — theme picker and selected ship.

These images are **visual targets**, not pixel-perfect specifications. AI-generated text and example data can be imperfect; the rules below govern implementation.

## Decisions to retain

1. Keep the **same five main navigation functions** across themes, in this order:
   - Watch TV
   - Streaming
   - Gaming & HDMI
   - Family Photos
   - Resort Views
2. **No Continue Watching row, Quick Apps row, or individual streaming apps on the home screen.** Streaming providers remain within the Streaming menu.
3. Switching theme should transform the **whole visual language**: header, background, colors, materials, textures, icons, button treatments, selection highlights, and decorative details. The location and behavior of the five main functions remain consistent.
4. **Animal Kingdom**: preserve the approved safari lodge atmosphere (warm wood, earth tones, greenery, gold accents, rich full-bleed landscape).
5. **Cruise**: use maritime blues, turquoise selection accents, ocean imagery, subtle compass / nautical motifs.
6. Add an accessible **Settings entry** (for example, a gear in the upper-right header), without treating it as a sixth main navigation button. Settings should also be reachable from the **Resort Views** section.
7. Settings must allow choosing a **theme** (at minimum Animal Kingdom vs Cruise) and, when Cruise is selected, a **specific ship**. Store the selection so it survives app restarts.
8. The Cruise home should include a compact ship-status panel showing:
   - Selected ship name
   - Last reported location or region
   - Next scheduled port of call
   - Clear timestamps or "last updated" labels for position and itinerary (these may come from different sources)
   - A clear stale/unavailable-data state, not fabricated live information
9. Consider making the ship-status panel open a larger interactive map/detail screen; this is a **proposed enhancement**, not yet separately approved.
10. The cruise mockup's ship, position, port, dates, and times are **sample data, not live ship tracking**. Validate the availability, terms, cost, and rights of any location/itinerary APIs before implementing live updates.
11. Weather/time/date should come from actual data and device/system settings in the app, not be hardcoded from mockups.

## Suggested next-session implementation order

1. Review this folder and the existing [V1 build specification](../../Guillory-Resort-V1-Build-Spec.md) alongside the current src code before changing anything.
2. Implement persistent theme/ship settings and the shared five-action navigation shell.
3. Implement theme-specific styles and backgrounds while retaining shared behavior.
4. Add the Cruise status-panel component behind a sample/fallback data provider.
5. Later integrate verified ship position and itinerary sources, including separate freshness timestamps, error states, and any necessary attribution.
6. Validate navigation with the LG remote and test on the **LG 86UN9070AUD / webOS 5.6.x** environment already used for this project.

## Review status

- **Approved direction**: Animal Kingdom home, Cruise home, and Cruise settings / ship-selection flow.
- **Not yet signed off**: exact live tracking data source, detailed map interaction, and production-ready image/text assets.
- **Do not replace** working TV/streaming launch behavior while adding these design changes.
