# The Guillory Resort — TV welcome screen and launcher (V1 prototype)

A lightweight, remote-controlled TV launcher with a resort welcome-screen feel.
It's built from [docs/Guillory-Resort-V1-Build-Spec.md](docs/Guillory-Resort-V1-Build-Spec.md).

Stack: Vite + TypeScript, plain DOM and CSS, and Vitest for unit tests. There's no UI framework.

## Organized by TV brand

```
src/                shared by every brand: screens, menus, focus logic, weather, clock, art
platforms/
  lg/               LG webOS: adapter, launch code, verified app IDs, manifest, icons, install guide
  vizio/            Vizio: feasibility notes (no code yet)
```

The UI never knows which TV it's on. Each brand folder exports a `PlatformAdapter` (see [src/platform/types.ts](src/platform/types.ts)), which says whether it's running on the real TV, how to open other apps, and which app ID each menu card uses. The brand is picked at build time: `vite build --mode <folder>` points the `@platform` import at `platforms/<folder>/index.ts` and copies that folder's `public/` into `dist/<folder>/`.

**To add a brand:** create `platforms/<brand>/index.ts` (plus `public/` if the brand needs a manifest), then add `build:<brand>` and `package:<brand>` scripts.

| Brand | Status | Guide |
| --- | --- | --- |
| LG webOS | ✅ Running on the family's 86UN9070AUD (webOS 5.6.2) | [platforms/lg/README.md](platforms/lg/README.md) |
| Vizio | Research only, since SmartCast has no consumer sideloading | [platforms/vizio/README.md](platforms/vizio/README.md) |

## Setup and commands

Requires Node.js 18+.

```sh
npm install
npm run dev          # desktop browser demo (uses the LG adapter; launches show a demo message)
npm test             # unit tests for shared code and every platform folder
npm run build:lg     # type-check + build into dist/lg/
npm run package:lg   # also creates out/lg/*.ipk
npm run install:lg   # also installs it on the paired LG TV
```

## Controls

| Key | TV remote | Action |
| --- | --- | --- |
| ← / → | Left / Right | Move focus across the dock, or across cards when an overlay is open |
| Enter | OK | Open the focused section, or activate the focused card |
| Esc / Backspace | Back (LG keyCode 461) | Close the overlay and return focus to its dock item |
| ↑ / ↓ | Up / Down | Accepted, but focus stays where it is (every row is horizontal) |
| Mouse | Magic Remote pointer | Hover to focus, click to activate, click the scenery to close |

## Shared code (`src/`)

```
main.ts                 bootstrap: state loop, key handling, launch effects
config.ts               family/resort text, weather settings
data/menu.ts            typed static menu (5 dock items, Watch TV + Streaming cards)
state/navigation.ts     pure focus/overlay state machine (unit tested)
input/keys.ts           keyboard + TV remote key mapping
platform/types.ts       PlatformAdapter interface that each brand implements
platform/launcher.ts    launchTarget(): browser demo / device modes, friendly failures
services/clock.ts       time and date formatting
services/weather.ts     Open-Meteo current conditions, IP-based location
components/             HomeScreen, TopHeader, WelcomeBar, ScenicHero, BottomDock,
                        OverlayPanel, NoticeDialog
ui/                     DOM helpers, line icons, streaming-app wordmarks
assets/                 original savanna art, header texture, app wordmarks (SVG)
```

## Status

**Working on the LG TV**
- Home screen, Watch TV and Streaming overlays, focus and Back behaviour, and the "Coming soon" placeholders for Gaming & HDMI, Family Photos and Resort Views.
- Live TV, Plex, Hulu, Peacock and Netflix launch, with app IDs confirmed on the TV.
- Live weather. It uses [Open-Meteo](https://open-meteo.com), which is free and needs no API key. The location comes from the household's external IP via [GeoJS](https://www.geojs.io), and the result is cached. It refreshes every 30 minutes. To pin a location, set `weather.location` in `src/config.ts`. Set `weather.mode` to `'placeholder'` or `'hidden'` to turn it off.

**Open items**
- LG Channels has no standalone app ID on this TV.
- Whether Back inside Netflix, Plex and the other apps returns to the Resort. That's up to each app.
- Auto-launch at power-on. It isn't available to Developer Mode apps; see the options in [platforms/lg/README.md](platforms/lg/README.md).

## Assets and licensing

- The savanna scene, header texture, line icons and app icon are original artwork made for this project.
- The Streaming tiles show the Plex, Hulu, Peacock and Netflix wordmarks. They come from Wikimedia Commons files marked public domain (see `src/ui/brandLogos.ts`). The marks are still trademarks of their owners and are used only to label each app. Selling or publishing the launcher would need a trademark review. Open-Meteo's free tier is also for non-commercial use only.
- Fonts come from the device's system fonts, so no font files are shipped. No Disney names, photos or marks are used.
