import type { City, CurrentWeather } from '../types'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

interface OpenMeteoResponse {
  current?: {
    time?: string
    temperature_2m?: number
    weather_code?: number
  }
}

export async function fetchCityWeather(city: City): Promise<CurrentWeather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,weather_code',
    temperature_unit: 'celsius',
    timezone: 'auto',
  })

  const res = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed for ${city.name}: ${res.status}`)
  }

  const data = (await res.json()) as OpenMeteoResponse
  const current = data.current
  if (
    !current ||
    typeof current.temperature_2m !== 'number' ||
    typeof current.weather_code !== 'number'
  ) {
    throw new Error(`Malformed Open-Meteo response for ${city.name}`)
  }

  return {
    temperatureC: current.temperature_2m,
    weatherCode: current.weather_code,
    time: current.time ?? '',
  }
}
