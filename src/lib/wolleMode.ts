import type { CityWeatherState } from '../types'

// Easter egg: when the user's name is "Wolle", every city is shown as rainy and
// cool — like London in autumn — regardless of the real fetched weather.
const WOLLE_NAME = 'wolle'

// WMO code 61 maps to "Rain" 🌧️ in weatherCodes.ts.
const RAIN_CODE = 61

export function isWolleMode(name: string): boolean {
  return name.trim().toLowerCase() === WOLLE_NAME
}

// Deterministic cool temperature (9–13 °C) varied by city index so cards aren't
// identical, but stable across re-renders.
export function wolleWeatherState(index: number): CityWeatherState {
  return {
    status: 'success',
    weather: {
      temperatureC: 9 + (index % 5),
      weatherCode: RAIN_CODE,
      time: '',
    },
  }
}
