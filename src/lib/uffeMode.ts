import type { City } from '../types'

// Easter egg: when the user's name is "Uffe", every city shows the *real* current
// weather in Voel (a village near Silkeborg, Denmark) instead of its own.
const UFFE_NAME = 'uffe'

export const VOEL: City = {
  name: 'Voel',
  country: 'Denmark',
  latitude: 56.19107,
  longitude: 9.69405,
}

export function isUffeMode(name: string): boolean {
  return name.trim().toLowerCase() === UFFE_NAME
}
