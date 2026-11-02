export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Wraps icon path markup in a decorative inline SVG. */
export function svgIcon(paths: string, className: string): HTMLSpanElement {
  const span = el('span', className);
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    `stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  return span;
}

/** Moves real DOM focus too, so assistive tech and the TV pointer agree with our state. */
export function focusElement(target: HTMLElement | undefined): void {
  if (target && document.activeElement !== target) target.focus({ preventScroll: true });
}

/**
 * The layout is authored on a 1920×1080 grid where 1rem = 16px. Scale the root
 * font size so the whole stage fits any 16:9 screen (720p, 1080p, 4K) crisply.
 */
export function fitStage(): void {
  const unit = Math.min(window.innerWidth / 120, window.innerHeight / 67.5);
  document.documentElement.style.fontSize = `${unit}px`;
}
