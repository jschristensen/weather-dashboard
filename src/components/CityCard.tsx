import type { City, CityWeatherState } from '../types'
import { weatherCodeToCondition } from '../lib/weatherCodes'
import './CityCard.css'

interface CityCardProps {
  city: City
  state: CityWeatherState
}

export function CityCard({ city, state }: CityCardProps) {
  return (
    <article className="city-card">
      <header className="city-card__header">
        <h2 className="city-card__name">{city.name}</h2>
        <p className="city-card__country">{city.country}</p>
      </header>

      {state.status === 'loading' && (
        <div className="city-card__body city-card__body--loading" aria-hidden="true">
          <div className="skeleton skeleton--icon" />
          <div className="skeleton skeleton--temp" />
          <div className="skeleton skeleton--label" />
        </div>
      )}

      {state.status === 'error' && (
        <div className="city-card__body city-card__body--error">
          <span className="city-card__icon">⚠️</span>
          <p className="city-card__unavailable">Unavailable</p>
        </div>
      )}

      {state.status === 'success' && <SuccessBody weather={state.weather} />}
    </article>
  )
}

function SuccessBody({ weather }: { weather: Extract<CityWeatherState, { status: 'success' }>['weather'] }) {
  const condition = weatherCodeToCondition(weather.weatherCode)
  return (
    <div className="city-card__body">
      <span className="city-card__icon" role="img" aria-label={condition.label}>
        {condition.icon}
      </span>
      <p className="city-card__temp">{Math.round(weather.temperatureC)}°C</p>
      <p className="city-card__condition">{condition.label}</p>
    </div>
  )
}
