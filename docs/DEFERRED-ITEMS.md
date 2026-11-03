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
| D-008 | Additional TV platforms | Vizio is research-only; assess TV-native installation without extra hardware or manufacturer partnerships. |
| D-009 | Production distribution and commercialization | Explicitly postponed until owner approves moving beyond Developer Mode. |

## Backlog maintenance

Add new deferred ideas with the next D-number, an explanation of desired behavior, known constraints, validation steps, and a decision/status. Keep feasibility findings distinct from verified implementations. Reference the primary V1 build specification in `docs/Guillory-Resort-V1-Build-Spec.md`.
