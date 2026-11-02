/** Household-facing text and display options. Platform details live in platform/. */

import type { Coordinates } from './services/weather';

export type WeatherMode = 'live' | 'placeholder' | 'hidden';

export interface AppConfig {
  resortTitle: string;
  welcomeLine: string;
  familyName: string;
  familySuffix: string;
  viewLabel: string;
  ribbonMessage: string;
  /**
   * live: Open-Meteo current conditions, located from the household's external IP
   * unless `location` is set. placeholder: neutral "--°". hidden: no weather slot.
   */
  weather: {
    mode: WeatherMode;
    unit: 'F' | 'C';
    refreshMinutes: number;
    location?: Coordinates;
  };
}

export const appConfig: AppConfig = {
  resortTitle: 'THE GUILLORY RESORT',
  welcomeLine: 'WELCOME HOME',
  familyName: 'GUILLORY',
  familySuffix: 'Family',
  viewLabel: 'SAVANNA VIEW',
  ribbonMessage: 'Relax, unwind, and enjoy your stay at The Guillory Resort.',
  weather: { mode: 'live', unit: 'F', refreshMinutes: 30 },
};
