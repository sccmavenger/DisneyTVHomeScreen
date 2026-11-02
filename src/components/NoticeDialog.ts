import type { NavAction, NavState } from '../state/navigation';
import { el } from '../ui/dom';

/** Friendly, dismissable message for unavailable apps and placeholders. */
export function createNoticeDialog(dispatch: (action: NavAction) => void) {
  const layer = el('div', 'notice');
  const box = el('div', 'notice__box');
  box.setAttribute('role', 'alertdialog');
  const title = el('h3', 'notice__title');
  const message = el('p', 'notice__message');
  const detail = el('p', 'notice__detail');
  const dismiss = el('button', 'notice__dismiss is-focused', 'OK');
  dismiss.type = 'button';
  dismiss.addEventListener('click', () => dispatch({ type: 'dismissNotice' }));
  box.appendChild(title);
  box.appendChild(message);
  box.appendChild(detail);
  box.appendChild(dismiss);
  layer.appendChild(box);

  return {
    el: layer,
    update(state: NavState) {
      const notice = state.notice;
      layer.classList.toggle('is-open', notice !== null);
      layer.setAttribute('aria-hidden', String(notice === null));
      if (!notice) return;
      title.textContent = notice.title;
      message.textContent = notice.message;
      detail.textContent = notice.detail || '';
      detail.style.display = notice.detail ? '' : 'none';
    },
    focusTarget(): HTMLElement {
      return dismiss;
    },
  };
}
