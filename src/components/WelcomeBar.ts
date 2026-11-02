import type { AppConfig } from '../config';
import { formatDate, formatTime, startClock } from '../services/clock';
import { startWeather, type WeatherReading } from '../services/weather';
import { el, svgIcon } from '../ui/dom';
import { icons, weatherIcons } from '../ui/icons';

const WEATHER_LABELS: Record<WeatherReading['kind'], string> = {
  clear: 'Clear',
  partly: 'Partly cloudy',
  cloudy: 'Cloudy',
  fog: 'Fog',
  rain: 'Rain',
  snow: 'Snow',
  storm: 'Thunderstorms',
};

function weatherIconFor(reading: WeatherReading): string {
  if (reading.kind === 'clear') return reading.isDay ? weatherIcons.clear : weatherIcons.clearNight;
  if (reading.kind === 'partly') return reading.isDay ? weatherIcons.partly : weatherIcons.partlyNight;
  return weatherIcons[reading.kind];
}

function createWeather(config: AppConfig) {
  const weather = el('div', 'weather');
  const iconSlot = el('span', 'weather__slot');
  const temp = el('span', 'weather__temp', '--°');
  iconSlot.appendChild(svgIcon(icons.sun, 'weather__icon'));
  weather.appendChild(iconSlot);
  weather.appendChild(temp);
  weather.setAttribute('aria-label', 'Weather unavailable');

  if (config.weather.mode === 'live') {
    startWeather(config.weather, (reading) => {
      iconSlot.innerHTML = '';
      iconSlot.appendChild(svgIcon(weatherIconFor(reading), 'weather__icon'));
      temp.textContent = `${Math.round(reading.temperature)}°`;
      weather.setAttribute(
        'aria-label',
        `${WEATHER_LABELS[reading.kind]}, ${Math.round(reading.temperature)} degrees ${config.weather.unit}`,
      );
    });
  }
  return weather;
}

export function createWelcomeBar(config: AppConfig) {
  const bar = el('section', 'welcome-bar');

  const greeting = el('div', 'welcome-bar__greeting');
  greeting.appendChild(el('div', 'welcome-bar__line', config.welcomeLine));
  const family = el('div', 'welcome-bar__family');
  family.appendChild(el('span', 'welcome-bar__name', config.familyName));
  family.appendChild(el('span', 'welcome-bar__suffix', config.familySuffix));
  greeting.appendChild(family);
  bar.appendChild(greeting);

  const info = el('div', 'welcome-bar__info');
  if (config.weather.mode !== 'hidden') {
    info.appendChild(createWeather(config));
    info.appendChild(el('span', 'welcome-bar__divider'));
  }
  const clock = el('div', 'clock');
  const time = el('div', 'clock__time');
  const date = el('div', 'clock__date');
  clock.appendChild(time);
  clock.appendChild(date);
  info.appendChild(clock);
  bar.appendChild(info);

  startClock((now) => {
    time.textContent = formatTime(now);
    date.textContent = formatDate(now);
  });

  return { el: bar };
}
