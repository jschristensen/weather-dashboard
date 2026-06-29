import type { WeatherCondition } from '../types'

// Maps WMO weather codes (returned by Open-Meteo) to a human label + icon.
// See https://open-meteo.com/en/docs
const CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: 'Clear sky', icon: '☀️' },

  1: { label: 'Partly cloudy', icon: '⛅' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Partly cloudy', icon: '⛅' },

  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Fog', icon: '🌫️' },

  51: { label: 'Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Drizzle', icon: '🌦️' },
  56: { label: 'Drizzle', icon: '🌦️' },
  57: { label: 'Drizzle', icon: '🌦️' },

  61: { label: 'Rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Rain', icon: '🌧️' },
  66: { label: 'Rain', icon: '🌧️' },
  67: { label: 'Rain', icon: '🌧️' },

  71: { label: 'Snow', icon: '❄️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Snow', icon: '❄️' },
  77: { label: 'Snow', icon: '❄️' },

  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌦️' },
  82: { label: 'Rain showers', icon: '🌦️' },

  85: { label: 'Snow showers', icon: '🌨️' },
  86: { label: 'Snow showers', icon: '🌨️' },

  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
}

const FALLBACK: WeatherCondition = { label: '—', icon: '🌡️' }

export function weatherCodeToCondition(code: number): WeatherCondition {
  return CONDITIONS[code] ?? FALLBACK
}
