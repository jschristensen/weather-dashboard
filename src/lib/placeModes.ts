import type { City } from '../types'

// Easter eggs that mirror a real place's current weather onto every city card.
// Add a new entry here and it works end to end — no other changes needed.
export interface PlaceMode {
  name: string // trigger name, lowercase
  place: City
  hint: string
}

export const PLACE_MODES: PlaceMode[] = [
  {
    name: 'uffe',
    place: { name: 'Voel', country: 'Denmark', latitude: 56.19107, longitude: 9.69405 },
    hint: "🇩🇰 Uffe mode: it's Voel weather everywhere",
  },
  {
    name: 'jasper',
    place: { name: 'Groningen', country: 'Netherlands', latitude: 53.21917, longitude: 6.56667 },
    hint: "🇳🇱 Jasper mode: it's Groningen weather everywhere",
  },
]

export function matchPlaceMode(name: string): PlaceMode | undefined {
  const n = name.trim().toLowerCase()
  return PLACE_MODES.find((m) => m.name === n)
}
