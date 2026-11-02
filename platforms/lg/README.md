# LG webOS platform

This folder holds everything LG-specific about The Guillory Resort. The shared UI lives in `/src`.

| File | Purpose |
| --- | --- |
| `index.ts` | The LG `PlatformAdapter`, selected with `--mode lg` |
| `webos.ts` | webOS detection and app launching through the Application Manager (built-in `PalmServiceBridge`, so no LG library is needed) |
| `targets.ts` | webOS app IDs for each menu card, each one confirmed on the family's TV |
| `targets.test.ts` | Fails if an app ID is added without a `verifiedOn` note |
| `public/` | `appinfo.json` (app manifest) and app icons, copied into the package |

## The family's TV

- **Model:** LG 86UN9070AUD (2020 UN90, made June 2021)
- **Software:** webOS 5.6.2, firmware 04.64.00
- **Paired as** ares device `guillorytv` (`prisoner@10.168.168.10:9922`)

Confirmed app IDs: Live TV `com.webos.app.livetv`, Plex `cdp-30`, Hulu `hulu`, Peacock `com.peacock.tv`, Netflix `netflix`. LG Channels has no standalone app ID on this TV.

### What this TV blocks

- `listLaunchPoints`, `listApps` and `getAppInfo` are denied, both from the Developer Mode shell and from inside a Developer Mode app. So app IDs can't be listed; they have to be found by trying candidates.
- `ares-launch <unknown-id>` fails with `<not exist>` and doesn't change the screen. A correct ID opens the app visibly, so **only test IDs when nobody is watching the TV**.
- Images: SVGs that define only a `viewBox` (no width or height) collapse to 0×0 in this TV's older Chromium unless the `<img>` has an explicit CSS width and height.

## 1. Tools (on the PC)

```sh
npm install -g @webos-tools/cli   # LG's ares-* commands; needs Node.js
ares --version
```

On Windows, run `ares-*` from PowerShell or cmd. They fail under Git Bash.

## 2. Developer Mode on the TV

LG's guide: https://webostv.developer.lge.com/develop/getting-started/developer-mode-app

1. Sign in to a free LG developer account on the TV.
2. Install **Developer Mode** from the LG Content Store, open it, and turn on **Dev Mode Status**. The TV restarts.
3. Turn on **Key Server**, and note the TV's IP address and passphrase.
4. **The session expires.** Press **Extend** in the Developer Mode app from time to time. If it lapses, Developer Mode apps are removed until reinstalled.

## 3. Pair the PC with the TV (one time)

The PC and TV must be on the same network.

```powershell
ares-setup-device -a guillorytv -i "{'host':'<TV IP>','port':'9922','username':'prisoner'}"
ares-novacom --device guillorytv --getkey
ares-setup-device -m guillorytv -i "{'privateKey':'guillorytv_webos','passphrase':'<PASSPHRASE>'}"
ares-device -i --device guillorytv   # should print the model and webOS version
```

## 4. Build, package, install

```sh
npm run build:lg      # type-check + build into dist/lg/
npm run package:lg    # also creates out/lg/com.guillory.resort_0.1.0_all.ipk
npm run install:lg    # also installs on the TV (doesn't launch it)
ares-launch  --device guillorytv com.guillory.resort
ares-inspect --device guillorytv --app com.guillory.resort   # remote DevTools for debugging
ares-install --device guillorytv --remove com.guillory.resort # uninstall
```

The build makes a single classic `<script defer>` bundle with relative paths. Packaged webOS apps load from `file://`, where module scripts are blocked. The bundle targets ES2015, which covers webOS 4 (2018) and later.

## 5. Adding or changing an app ID

1. Make sure nobody is watching the TV.
2. Try the candidate ID: `ares-launch --device guillorytv <app-id>`. If it prints `<not exist>`, the ID is wrong. If it launches, confirm on screen that it opened the right app.
3. Put the ID in `targets.ts`, with `verifiedOn` set to the model, webOS version and date.
4. Test it from the launcher itself, including what Back does inside the app. Returning to the Resort isn't guaranteed.

## Out of scope for V1

Auto-launch at power-on, replacing the stock Home screen, remapping the Home button, and rooting are out of scope. None of them is available to an ordinary Developer Mode app. Auto-launch would need an always-on helper device on the network, and rooting would need explicit approval and a rollback plan.
