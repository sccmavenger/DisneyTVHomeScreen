import { describe, expect, it } from 'vitest';
import { formatDate, formatTime } from './clock';

describe('clock formatting', () => {
  it('formats 12-hour time with AM/PM', () => {
    expect(formatTime(new Date(2026, 10, 1, 0, 5))).toBe('12:05 AM');
    expect(formatTime(new Date(2026, 10, 1, 9, 30))).toBe('9:30 AM');
    expect(formatTime(new Date(2026, 10, 1, 12, 0))).toBe('12:00 PM');
    expect(formatTime(new Date(2026, 10, 1, 16, 45))).toBe('4:45 PM');
  });

  it('formats the date as weekday, month day', () => {
    expect(formatDate(new Date(2026, 10, 1))).toBe('Sunday, November 1');
  });
});
