export interface City {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  temperatureC: number
  weatherCode: number
  time: string
}

export interface WeatherCondition {
  label: string
  icon: string
}

export type CityWeatherState =
  | { status: 'loading' }
  | { status: 'success'; weather: CurrentWeather }
  | { status: 'error' }
