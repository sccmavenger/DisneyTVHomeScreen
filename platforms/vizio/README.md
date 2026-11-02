# Vizio: feasibility notes (no code yet)

The shared Resort UI in `src/` would run unchanged on any TV-class browser. What's brand-specific is how it gets installed, and whether it can open other apps or switch inputs. A Vizio adapter would live in this folder as `index.ts`, implementing `PlatformAdapter` from `src/platform/types.ts`, the same way `platforms/lg/` does.

## Findings so far (not yet verified against current Vizio developer docs)

- **No consumer sideloading.** Vizio SmartCast has no equivalent of LG's Developer Mode. Apps reach the TV only through Vizio's partner program.
- **Chromecast built-in.** Most SmartCast TVs can show a custom Google Cast receiver page, which is our web app. The TV remote generally doesn't reach a Cast receiver, so it would be display-only: welcome screen, photos, weather. A phone would do the controlling.
- **Streaming stick (recommended).** Running the Resort on a Google TV or Fire TV stick plugged into the Vizio gives full remote control. Each stick would get its own folder here (for example `platforms/googletv/` or `platforms/firetv/`): a small Android WebView wrapper plus that platform's app IDs.

## Next steps when we pick this up

1. Confirm the Vizio model and current SmartCast/Vizio OS version.
2. Check the current Vizio developer program terms.
3. Choose between a Cast receiver (display-only) and a streaming-stick build.
