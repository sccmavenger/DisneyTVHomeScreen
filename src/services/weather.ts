/**
 * Current conditions from Open-Meteo (free, no API key) for a location taken
 * from config, or looked up once from the household's external IP via GeoJS.
 * One request per refresh interval; the last reading is cached so the header
 * fills in instantly on the next launch. Failures keep the last good reading.
 */

export type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export interface WeatherReading {
  temperature: number;
  kind: WeatherKind;
  isDay: boolean;
  /** Epoch ms when fetched. */
  at: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherOptions {
  unit: 'F' | 'C';
  refreshMinutes: number;
  /** Fixed location; when omitted the location is looked up from the external IP. */
  location?: Coordinates;
}

const GEO_URL = 'https://get.geojs.io/v1/ip/geo.json';
const CACHE_KEY = 'guillory.weather';
const LOCATION_KEY = 'guillory.location';

/** WMO weather interpretation codes, as used by Open-Meteo. */
export function weatherCodeToKind(code: number): WeatherKind {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain'; // drizzle 51-57, rain 61-67, showers 80-82
}

export function forecastUrl(at: Coordinates, unit: 'F' | 'C'): string {
  return (
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${at.latitude.toFixed(3)}&longitude=${at.longitude.toFixed(3)}` +
    '&current=temperature_2m,weather_code,is_day' +
    (unit === 'F' ? '&temperature_unit=fahrenheit' : '')
  );
}

export function parseForecast(body: unknown, now: number): WeatherReading | null {
  const current = body ? (body as { current?: Record<string, unknown> }).current : undefined;
  if (!current) return null;
  const temperature = Number(current.temperature_2m);
  const code = Number(current.weather_code);
  if (!isFinite(temperature) || !isFinite(code)) return null;
  return { temperature, kind: weatherCodeToKind(code), isDay: current.is_day !== 0, at: now };
}

export function parseGeo(body: unknown): Coordinates | null {
  const geo = body as { latitude?: unknown; longitude?: unknown } | null;
  if (!geo) return null;
  const latitude = Number(geo.latitude);
  const longitude = Number(geo.longitude);
  if (!isFinite(latitude) || !isFinite(longitude)) return null;
  return { latitude, longitude };
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable; weather still works without the cache.
  }
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function resolveLocation(options: WeatherOptions): Promise<Coordinates | null> {
  if (options.location) return options.location;
  const cached = readStorage<Coordinates>(LOCATION_KEY);
  if (cached) return cached;
  const located = parseGeo(await getJson(GEO_URL));
  if (located) writeStorage(LOCATION_KEY, located);
  return located;
}

/** Starts periodic weather updates. Returns a stop function. */
export function startWeather(options: WeatherOptions, onReading: (reading: WeatherReading) => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const interval = options.refreshMinutes * 60000;

  const cached = readStorage<WeatherReading>(CACHE_KEY);
  if (cached) onReading(cached);

  const refresh = async () => {
    try {
      const location = await resolveLocation(options);
      if (location) {
        const reading = parseForecast(await getJson(forecastUrl(location, options.unit)), Date.now());
        if (reading && !stopped) {
          writeStorage(CACHE_KEY, reading);
          onReading(reading);
        }
      }
    } catch {
      // Offline or service unavailable: keep showing the last reading.
    }
    if (!stopped) timer = setTimeout(refresh, interval);
  };

  // Skip the immediate request when the cached reading is still fresh.
  const age = cached ? Date.now() - cached.at : Infinity;
  timer = setTimeout(refresh, age < interval ? interval - age : 0);

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
