import './styles.css';
import { createHomeScreen } from './components/HomeScreen';
import { appConfig } from './config';
import { sections } from './data/menu';
import { keyToAction } from './input/keys';
import { createLauncher } from './platform/launcher';
import { initialState, reduce, type LaunchEffect, type NavAction, type NavState } from './state/navigation';
import { fitStage } from './ui/dom';
// Brand-specific adapter from platforms/<PLATFORM>/ (see vite.config.ts).
import { platform } from '@platform';

const launchTarget = createLauncher({
  mode: platform.isDevice() ? 'device' : 'browserDemo',
  targets: platform.launchTargets,
  bridge: platform.launchBridge,
});

let state: NavState = initialState;

const screen = createHomeScreen({ sections, config: appConfig, dispatch });

function dispatch(action: NavAction): void {
  const result = reduce(state, action, sections);
  if (result.state !== state) {
    state = result.state;
    screen.update(state);
  }
  if (result.effect) void runLaunch(result.effect);
}

async function runLaunch(effect: LaunchEffect): Promise<void> {
  const result = await launchTarget(effect.targetId);
  if (result.notice) dispatch({ type: 'showNotice', notice: result.notice });
}

document.addEventListener('keydown', (event) => {
  const action = keyToAction(event);
  if (!action) return;
  // Also stops the browser's own Enter-click and Backspace navigation.
  event.preventDefault();
  dispatch(action);
});

fitStage();
window.addEventListener('resize', fitStage);
document.getElementById('app')!.appendChild(screen.el);
screen.update(state);
