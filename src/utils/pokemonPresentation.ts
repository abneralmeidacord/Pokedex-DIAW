import type { PokemonType } from '../types/pokemon'

const typePresentation: Readonly<Record<number, { label: string; color: string }>> = {
  0: { label: 'Sem tipo', color: '#e4e8f0' },
  1: { label: 'Normal', color: '#d8decb' },
  2: { label: 'Fogo', color: '#ffa76c' },
  3: { label: 'Água', color: '#86b2f2' },
  4: { label: 'Planta', color: '#9ed886' },
  5: { label: 'Elétrico', color: '#ffe47c' },
  6: { label: 'Gelo', color: '#a4e1df' },
  7: { label: 'Lutador', color: '#e99a8e' },
  8: { label: 'Veneno', color: '#c197df' },
  9: { label: 'Terra', color: '#e8c38f' },
  10: { label: 'Voador', color: '#b8c7ef' },
  11: { label: 'Psíquico', color: '#f4a2bd' },
  12: { label: 'Inseto', color: '#c8db8b' },
  13: { label: 'Pedra', color: '#d5c790' },
  14: { label: 'Fantasma', color: '#b0a0cf' },
  15: { label: 'Sombrio', color: '#b6a89f' },
  16: { label: 'Dragão', color: '#b3a0ee' },
  17: { label: 'Aço', color: '#bfcbd6' },
}

export function getPokemonTypeLabel(type: PokemonType): string {
  return typePresentation[type.id]?.label ?? type.name
}

export function getPokemonTypeColor(type?: PokemonType): string {
  return typePresentation[type?.id ?? 0]?.color ?? typePresentation[0].color
}

// https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
export function getPokemonImageSource(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
