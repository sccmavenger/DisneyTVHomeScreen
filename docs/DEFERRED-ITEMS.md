# Deferred Items — The Guillory Resort

Last updated: 2026-11-02

This is the running backlog of capabilities intentionally deferred from the current LG webOS Developer Mode prototype. These are **not commitments or implemented features**. Revisit each item after feasibility, compatibility, and user experience are validated.

## D-001 — Ring smart-home camera alerts and live view

**Status:** Deferred — investigation and proof of concept needed  
**Priority:** To be decided  
**Platforms:** LG webOS 5.6.2 initially; reusable integration design for future TVs

### Desired experience
- Detect Ring doorbell presses and camera motion events.
- Identify the camera that generated an event.
- Show an alert with a snapshot and, when selected, a live camera feed.
- Ideally show a small live camera overlay while Netflix, Plex, Hulu, or Live TV continues playing.
- Allow per-camera alert settings, doorbell priority, quiet hours, dismissal, and opt-in interruption behavior.

### Current findings and limitations
- Ring has developer integrations for events and live video, but developer onboarding, permissions, account/subscription eligibility, and the actual stream handshake must be validated.
- An ordinary LG webOS third-party application can show an in-app alert while The Guillory Resort is in the foreground.
- System-wide overlays on top of unrelated apps are not available through the ordinary public third-party webOS application APIs. Do not promise picture-in-picture over Netflix or Live TV.
- webOS background app suspension prevents relying on the Resort app itself as a continuously running event listener.
- An external controller might remotely launch the Resort when an event occurs, but that would interrupt viewing and return-to-previous-app/playback is not guaranteed. This does **not** satisfy the no-extra-hardware product requirement without an acceptable cloud/TV-only design.
- Live stream playback compatibility with the older webOS browser is unverified; transcoding may be necessary.
- Any backend must protect Ring credentials and authenticate/validate incoming event notifications.

### Proposed validation steps
1. Confirm Ring developer program access, permitted use, authentication, webhook delivery, live video interfaces, and any applicable fees/subscription requirements.
2. Build a minimal backend prototype to receive events and associate each event with a camera.
3. Test a live feed inside the Resort on the LG 86UN9070AUD (webOS 5.6.2).
4. Test foreground notification UX and configurable event filtering.
5. Separately investigate whether any officially supported cross-app alert or launch mechanism exists for each target TV platform; do not assume one exists.
6. Review privacy, consent, credentials, camera access, latency, reliability, and operating costs before deciding whether to implement.

### Decision / exit criteria
- **Initial acceptable scope:** Ring alerts and live camera viewing while the Resort app is open, if official access and playback tests pass.
- **Deferred advanced scope:** Alerts while another app is active, automatic app switching, and true picture-in-picture.
- **Constraints:** No rooting, no additional customer hardware, no LG partnership; stay in Developer Mode until the owner authorizes production preparation.
- **Decision owner:** Project owner. No implementation approved yet.

## Other deferred topics already identified in the V1 specification

These are tracked as separate future candidates; their scope and priority have not yet been decided.

| ID | Item | Current note |
| --- | --- | --- |
| D-002 | Automatic launch on TV power-on | Prefer where officially supported; otherwise remain a manually launched app. LG Developer Mode does not provide an ordinary app autostart mechanism. |
| D-003 | Returning to Resort after external streaming apps | Behavior depends on TV/app; needs real-device testing. |
| D-004 | Gaming & HDMI device/input selection | Placeholder today; verify supported input-switching APIs. |
| D-005 | Family Photos and slideshow | Placeholder today; decide photo source, privacy, and display behavior. |
| D-006 | Resort Views and theme switching | Placeholder today; use original or properly licensed assets. |
| D-007 | LG Channels and TV favorites | LG Channels app launch ID unavailable on current device; cross-service channel aggregation not in V1. |
| D-008 | Vizio TV support | Deferred pending a retail SmartCast/Conjure proof of concept and device compatibility testing; see detailed scope below. |
| D-009 | Production distribution and commercialization | Explicitly postponed until owner approves moving beyond Developer Mode. |

## D-008 — Vizio TV support

**Status:** Deferred — research completed; hardware validation pending  
**Priority:** To be decided  
**Target:** Run The Guillory Resort on a consumer Vizio TV without a streaming stick, extra hardware, or mandatory manufacturer partnership.

### Research findings
- Vizio SmartCast development workflows include HTML/JavaScript applications, Conjure launch mechanisms, provisioned developer TVs, and Chrome DevTools debugging.
- Professional developer documentation describes Vizio-enabled development configurations, but no verified LG-style self-service Developer Mode activation was established for retail TVs.
- Some SmartCast generations have documented methods to launch hosted HTML applications on retail devices using local-network pairing and Conjure. This is **not** equivalent to permanently installing a native app or replacing Vizio's home screen.
- Actual support on the owner's Vizio model/firmware is unknown until the TV is available.
- Remote hardware testing services such as TV Labs may be an option, subject to access, cost, and device availability.

### Future validation plan
1. Record Vizio model number, firmware version, and SmartCast/Vizio Home generation.
2. Verify whether the model supports the documented Conjure pairing and hosted-app launch workflow.
3. Test the existing shared Resort interface in the TV runtime.
4. Verify Vizio remote navigation, focus, Back behavior, performance, and video playback.
5. Test launching installed streaming apps and returning to the Resort.
6. Determine whether persistent installation, startup, or an app tile is officially available without a manufacturer relationship.
7. Evaluate professional development access or remote hardware labs only if needed.

### Decision / exit criteria
- Do not claim support or implement a production Vizio adapter until the retail-TV proof of concept succeeds.
- No extra customer hardware, rooting, or unsupported firmware modifications.
- If retail Conjure launching is incompatible or too limited, leave Vizio deferred and document the blocker.

### Research references
- [TrueX Vizio SmartCast reference app](https://github.com/socialvibe/truex-ctv-web-reference-app/blob/develop/platforms/Vizio/README.md)
- [TV Labs SmartCast platform documentation](https://docs.tvlabs.ai/platform/platforms/smartcast)
- [BlackBox QA Vizio installation guide](https://www.blackboxqa.ca/vizio-installation)
- [get-air/vizio open-source SmartCast control library](https://github.com/get-air/vizio)

## Backlog maintenance

Add new deferred ideas with the next D-number, an explanation of desired behavior, known constraints, validation steps, and a decision/status. Keep feasibility findings distinct from verified implementations. Reference the primary V1 build specification in `docs/Guillory-Resort-V1-Build-Spec.md`.
