# The Guillory Resort — webOS Launcher V1

**Implementation handoff for Claude Code or Codex**  
**Status:** Design approved for Home, Watch TV, and Streaming; TV compatibility pending.  
**Prepared:** November 1, 2026

## 1. Product goal

Create a fast, lightweight, remote-controlled **LG webOS TV application** that recreates the feel of a luxury resort television welcome screen for the Guillory family. It should preserve the striking scenic resort image while menus open in translucent overlays. The user's approved name is **The Guillory Resort**.

Develop and test the app using LG's official Developer Mode and webOS tooling, starting with a working browser prototype. **Do not attempt to root, alter system files, replace stock Home, modify boot services, or assume automatic power-on launch** during V1 development. Those require separate hardware/firmware review and explicit authorization.

### What the user has approved

1. **Home:** A resort-inspired, full-screen landscape with textured dark patterned top strip; warm rust/copper welcome band; large **WELCOME HOME / GUILLORY Family** text; weather, time and date at the top right; scenic large hero; a small ribbon-style caption; a cream-colored five-item bottom navigation dock.
2. **Main navigation, in this exact order:** **Watch TV**, **Streaming**, **Gaming & HDMI**, **Family Photos**, **Resort Views**.
3. **Watch TV overlay:** A floating espresso-brown/gold-bordered panel over the still-visible resort background, with three options **Live TV**, **LG Channels**, **Favorites**. Focused card has a bright, restrained gold outline. The first card is initially focused.
4. **Streaming overlay:** The same panel pattern with four options, in this exact order: **Plex**, **Hulu**, **Peacock**, **Netflix**. Initially focus Plex.
5. **Navigation style:** Large readable labels, simple directional focus states, OK/select, Back/close; no additional setup wizard or long-press shortcuts in V1.

**Do not redesign the approved home screen or the two approved overlays.** Treat the visuals shown in this conversation as visual references; do not use the attached photograph of a Disney resort TV as a production runtime asset.

## 2. V1 scope and boundaries

### Build now

- Single-family local experience with fixed family label **GUILLORY Family** and product title **THE GUILLORY RESORT**.
- Responsive TV-first interface at 1920×1080 baseline, scalable to 4K without requiring 4K textures.
- Decorative resort background loaded from a local, properly licensed or original image asset. A temporary generic savanna-style placeholder is acceptable during development.
- Dynamic local date/time and a weather display component that gracefully shows a placeholder or hides weather if no approved weather service is configured.
- Home navigation dock with five items and persistent focus indication.
- Functional, non-blocking Watch TV and Streaming overlays with remote/keyboard interaction.
- A lightweight native-launch adapter: on selection, attempt an installed-app launch only when the TV model/app ID and permissions are verified; otherwise show a friendly, non-breaking "Not configured on this TV" message.
- Placeholder overlays for Gaming & HDMI, Family Photos, and Resort Views if not yet specified. Keep the five navigation labels visible. Do **not** invent large feature sets for these sections.
- A webOS package that can be installed and run in **Developer Mode**, after hardware compatibility is checked.

### Explicitly defer

- Rooting and stock-Home takeover; automatic startup at TV power-on; remapping the physical Home button.
- An onboarding wizard, profiles, configurable menu logic per household, cloud account, telemetry, ads, payment, licensing, or multi-tenant architecture.
- Automatic discovery/aggregation of all television channels, personalized program guides or favorites across unrelated services.
- Deep linking to specific titles inside Plex/Hulu/Peacock/Netflix.
- Photo sync from cloud services, Plex-server browsing, smart-home integration, ambient music, and automatic resort switching.
- Any unauthorized redistribution of Disney names/logos/photography/music or third-party app assets.

## 3. Detailed screen behavior

### 3.1 Home

- **Top strip:** Decorative dark patterned strip, left title "THE GUILLORY RESORT", right currently selected view label (initially "SAVANNA VIEW").
- **Welcome bar:** Warm terracotta/copper strip, left "WELCOME HOME" over "GUILLORY Family", right simple weather icon, temperature, clock and date.
- **Hero:** Edge-to-edge resort/savanna scenic photo. Text overlays remain contrast-safe. Avoid continuous video or expensive effects on older hardware.
- **Information ribbon:** Small dark caption ribbon near the lower-left of the hero; show a neutral welcome message about the family's resort experience.
- **Dock:** Cream/parchment background with five equal-footprint icon-and-label controls and subtle dividers. One item receives a gold focus/selection treatment. On first launch, focus **Watch TV**.
- **Click/OK on dock item:** Open corresponding overlay in front of hero, preserving visible top strips, hero edges, and dock; focus first selectable card inside overlay.

### 3.2 Watch TV overlay

**Heading:** "WATCH TV"  
**Subtitle:** "Choose what you want to watch."

| Card | Intended meaning | Initial action strategy |
| --- | --- | --- |
| Live TV | Traditional TV via tuner/antenna/cable, depending on the TV | Show stub until system launch/input behavior has been validated on the target model. |
| LG Channels | LG's free, ad-supported internet TV service | Attempt its verified native app ID, otherwise show an explanatory unavailable state. |
| Favorites | Favorite *television channels*, not favorite streaming apps | Placeholder "Favorites will be available after TV setup" in V1; do not promise channel aggregation. |

**Focus:** The first card, Live TV, receives a gold outline when the overlay opens. Left/right keys traverse the three cards. Back closes the overlay and restores focus to Watch TV in the dock.

### 3.3 Streaming overlay

**Heading:** "STREAMING"  
**Subtitle:** "Choose an app to watch."

| Order | App | Intent |
| --- | --- | --- |
| 1 | Plex | Launch the already-installed Plex webOS app; do not access the family's Plex server directly in V1. |
| 2 | Hulu | Launch native installed Hulu app. |
| 3 | Peacock | Launch native installed Peacock app. |
| 4 | Netflix | Launch native installed Netflix app. |

**Focus:** Plex first, then horizontal navigation. OK launches the chosen installed app when supported/configured. Back closes the overlay. Use recognizable, legally sourced icons; fall back to text-only tiles if brand art is unavailable. Do not ask for account credentials or store streaming passwords.

**Important platform constraint:** LG documents an Application Manager API that can launch a specified app, but available app IDs/privileges and the ability to return to our launcher after exiting a third-party app vary. **Do not promise that Back within Netflix/Plex returns to The Guillory Resort.** This behavior must be tested; native app context takes over after launch.

### 3.4 Remaining buttons

These are visible in the approved home design, but their detailed designs have not yet been approved:

- **Gaming & HDMI:** Initial simple placeholder. Later map user-labelled physical HDMI devices after verifying whether switching inputs is possible through approved APIs on this TV.
- **Family Photos:** Initial simple placeholder. Later add user-provided albums and full-screen slideshow after determining local/network storage source.
- **Resort Views:** Initial simple placeholder. Later select a licensed/original scenery theme; update the hero and a small theme label without reloading the whole app.

Do not silently substitute speculative screens for these approved-but-unspecified features.

## 4. Interaction contract

| Input | Behavior |
| --- | --- |
| Left / Right | Move focus between dock items when overlay closed; among cards when open. |
| OK / Enter | Open the focused dock section or activate its focused card. |
| Back / Escape | Close active overlay; return focus to its dock item. |
| Up / Down | Optional alternate direction navigation; never trap or lose focus. |
| Pointer / mouse | Click the same elements; do not require pointer for TV use. |
| TV Home key | Outside control of an ordinary Developer Mode app. No override in V1. |

- Always show which item is focused. Visible focus must not be conveyed only by color.
- Keep readable text/targets at couch distance, with overscan-safe margins and accessible contrast.
- Avoid slow parallax, autoplay video, heavy animated backgrounds, and excessive network calls.
- If an app launch fails, preserve UI and offer "App unavailable or not configured" with a dismiss action.
- Avoid noisy placeholder content and any fictional live channel lists or unverified app IDs.

## 5. Architecture recommendation

- **Stack:** A small Vite + TypeScript **web app** with HTML/CSS; use minimal dependencies and avoid a heavyweight UI framework unless a benchmark shows acceptable performance on the actual TV. This is a TV remote UI, not a general responsive dashboard.
- **App shell:** `HomeScreen`, `TopHeader`, `WelcomeBar`, `ScenicHero`, `BottomDock`, and `OverlayPanel` reusable components.
- **Menu data:** A typed, static structure for the approved five dock items and Watch TV / Streaming cards. Only the native-launch adapter knows webOS app IDs or input APIs.
- **Launch abstraction:** `launchTarget(targetId)` implementation with `browserDemo` mode (show confirmation/stub) and `webOS` mode (call supported APIs after device verification). Provide helpful errors.
- **Keyboard/focus controller:** Explicit state for focused dock index, active overlay, focused overlay-card index. Use the same navigation contract with remote key events and desktop keyboard.
- **Assets:** Package a lightweight original resort photo, app card icons, and a small texture set. Verify output size and licensing. Store UI text and styles separately from platform integration.
- **Packaging:** Use current **webOS CLI** and optionally LG **webOS Studio** for VS Code; package an `.ipk` only after a browser/demo build works.
- **Testing without the TV:** Use `npm run dev` in a desktop browser; keyboard should reproduce arrow/OK/Back navigation. Unit tests cover focus and menu mappings.

## 6. Implementation milestones for today

1. **Baseline (no TV required):** Scaffold TypeScript project; render approved home screen; ensure assets aren't copied from the Disney screenshot; enable browser keyboard navigation.
2. **Menus (no TV required):** Implement Watch TV with 3 cards and Streaming with 4 cards. Verify visual consistency against approved images and focus/Back behavior.
3. **Adapter (no TV required):** Add a mocked launch target layer with unit tests and placeholders; avoid hardcoding undocumented app IDs or touching any LG system settings.
4. **TV inspection (requires Danny's model number):** Determine exact LG model, release year, webOS version, firmware, whether Developer Mode is available, and whether Plex/Hulu/Peacock/Netflix are actually installed. Identify any incompatibility before attempting the install.
5. **Developer Mode deployment (requires TV and access):** Connect PC and TV over same network, pair through developer key server, package/install `.ipk`, and test actual remote focus/performance. Try native launch integration only for verified supported targets.
6. **Optional future feasibility research:** Assess power-on launch and Home key replacement separately. No rooting or privileged changes without explicit instruction and a rollback plan.

## 7. Acceptance criteria

**Visual**

- Home preserves approved branded header, personalized greeting, large scenic view, five-button cream dock and gold selection state.
- Watch TV overlay shows exactly **Live TV / LG Channels / Favorites**.
- Streaming overlay shows exactly **Plex / Hulu / Peacock / Netflix**, in that order.
- Scenic background remains visible outside the centered overlay.
- UI is readable on a 16:9 TV and remains usable on 1080p and 4K screens.

**Functional**

- The UI launches without errors in a desktop browser demo and can be operated entirely by arrow keys, Enter, and Escape.
- All five dock items receive focus; opening Watch TV and Streaming gives the first card focus; Back restores the prior dock focus.
- Missing native-app IDs or TV APIs produce graceful feedback rather than application failure.
- No account credentials, no private photo imports, no external writes, and no device modifications are needed for the browser demo.
- Actual app launches, input switching, and return-to-launcher behavior must be labeled **unverified** until tested on Danny's TV.

**Performance targets (provisional, validate on real hardware)**

- Fast first paint, no perceptible arrow-key lag, and smooth overlay transitions.
- No ongoing animation/network fetching required for basic navigation.
- Defer image loading where appropriate and cache local scenery; do not claim a measurable TV performance improvement without profiling.

## 8. Known unknowns and important caveats

**Waiting for TV details:** exact model, OS and firmware determine API support and whether a regular Developer Mode app is sufficient. Some implementations of custom boot launch require root, which carries real risk and does not scale well for a consumer product.

**LG official guidance:** Developer Mode supports testing/installing custom apps. It does not grant an official automatic app-start-on-power-on API. The Application Manager allows app launching but third-party app ID access and native return behavior have restrictions. Direct HDMI input control is not a generally documented public TV app API. Build without promising these capabilities.

**Commercialization:** A V1 personal prototype can use independently created resort-like visuals. Selling the launcher requires a review of image/music/font licenses, app brand marks, naming/trademarks, platform store policy, startup method, permissions, and customer installation experience. Do not ship the user's Disney hotel TV photo or generated unofficial Disney marks as product assets.

## 9. Handoff prompt — paste into Claude Code or Codex

> Build a lean TypeScript webOS TV launcher prototype named **The Guillory Resort**, following the attached `Guillory-Resort-V1-Build-Spec.md` exactly. Begin with a local browser-runnable Vite app. Implement the approved home screen plus Watch TV and Streaming overlays, remote/keyboard navigation, resilient focus handling, and a mockable native launch adapter. Keep Gaming & HDMI, Family Photos, and Resort Views visible but as explicitly labeled placeholders until their designs are approved. Use only original/licensed art, text fallbacks for unavailable app icons, and never hardcode unverified LG app IDs. Provide `README.md`, setup commands, unit tests for navigation, and a short webOS packaging/deployment guide. Do not attempt rooting, startup/home button takeover, third-party account integration, or hardware configuration. Stop before device-specific actions and request the exact LG model/webOS/firmware information. Report what works in browser simulation versus what still requires TV verification.

## 10. References for implementation

- LG Developer Mode: https://webostv.developer.lge.com/develop/getting-started/developer-mode-app
- LG web app guide: https://webostv.developer.lge.com/develop/getting-started/build-your-first-web-app
- LG Application Manager / lifecycle: https://webostv.developer.lge.com/develop/guides/app-lifecycle-management
- LG public support for no boot autostart API: https://forum.webostv.developer.lge.com/t/how-to-make-the-app-launch-automatically-after-power-on/28121
- Official API limitation on returning from a third-party app: https://forum.webostv.developer.lge.com/t/launch-app-but-keep-existing-one-after-exit/3591
- Official input/API limitation: https://forum.webostv.developer.lge.com/t/get-set-current-source-in-lg-webos-tv-programatically-api/16338

