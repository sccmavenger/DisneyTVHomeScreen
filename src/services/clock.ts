const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "4:05 PM" */
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

/** "Sunday, November 1" */
export function formatDate(date: Date): string {
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** Calls onTick now and at each minute boundary (one timer, no per-second polling). */
export function startClock(onTick: (now: Date) => void): () => void {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    const now = new Date();
    onTick(now);
    timer = setTimeout(tick, 60000 - now.getSeconds() * 1000 - now.getMilliseconds() + 50);
  };
  tick();
  return () => clearTimeout(timer);
}
