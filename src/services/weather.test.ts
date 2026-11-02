import { describe, expect, it } from 'vitest';
import { forecastUrl, parseForecast, parseGeo, weatherCodeToKind } from './weather';

describe('weather', () => {
  it('maps WMO codes to display kinds', () => {
    expect(weatherCodeToKind(0)).toBe('clear');
    expect(weatherCodeToKind(2)).toBe('partly');
    expect(weatherCodeToKind(3)).toBe('cloudy');
    expect(weatherCodeToKind(45)).toBe('fog');
    expect(weatherCodeToKind(53)).toBe('rain');
    expect(weatherCodeToKind(81)).toBe('rain');
    expect(weatherCodeToKind(73)).toBe('snow');
    expect(weatherCodeToKind(86)).toBe('snow');
    expect(weatherCodeToKind(95)).toBe('storm');
  });

  it('builds a Fahrenheit Open-Meteo URL with rounded coordinates', () => {
    const url = forecastUrl({ latitude: 38.74721, longitude: -90.72469 }, 'F');
    expect(url).toContain('latitude=38.747&longitude=-90.725');
    expect(url).toContain('temperature_unit=fahrenheit');
    expect(forecastUrl({ latitude: 1, longitude: 2 }, 'C')).not.toContain('temperature_unit');
  });

  it('parses a current-conditions response', () => {
    const body = { current: { temperature_2m: 58.9, weather_code: 3, is_day: 0 } };
    expect(parseForecast(body, 123)).toEqual({ temperature: 58.9, kind: 'cloudy', isDay: false, at: 123 });
  });

  it('rejects malformed responses', () => {
    expect(parseForecast({}, 0)).toBeNull();
    expect(parseForecast({ current: { temperature_2m: 'x', weather_code: 1 } }, 0)).toBeNull();
    expect(parseGeo({ latitude: 'n/a' })).toBeNull();
    expect(parseGeo({ latitude: '38.7472', longitude: '-90.7247' })).toEqual({ latitude: 38.7472, longitude: -90.7247 });
  });
});
