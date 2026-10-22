export const TRAINERS_HREF = '#treinadores'

export function getTrainerHref(trainerId: number): string {
  return `#treinadores/${trainerId}`
}


export function getPokemonHref(pokemonId: number): string {
  return `#pokemon/${pokemonId}`
}

export function getTrainerIdFromHash(hash: string): number | null {
  const match = /^#treinadores\/(\d+)$/.exec(hash)
  return match ? Number(match[1]) : null
}