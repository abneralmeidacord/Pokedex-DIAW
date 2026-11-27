import type { PokedexData, Pokemon, Trainer } from '../types/pokemon'

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`A API da Pokédex retornou HTTP ${response.status} em ${url}.`)
  }
  return response.json()
}

// Tipos e Pokémon vêm de /api/pokedex; os treinadores vêm da coleção `trainers` via /api/trainers.
export async function loadPokedex(signal: AbortSignal): Promise<PokedexData> {
  const [catalog, trainers] = await Promise.all([
    fetchJson<Omit<PokedexData, 'trainers'>>('/api/pokedex', signal),
    fetchJson<readonly Trainer[]>('/api/trainers', signal),
  ])
  return { ...catalog, trainers }
}

export function getPokemonById(pokedex: PokedexData, id: number): Pokemon | undefined {
  return pokedex.pokemon.find((pokemon) => pokemon.id === id)
}

export function getPokemonNeighbors(
  pokedex: PokedexData,
  id: number
): {
  previous: Pokemon | undefined
  next: Pokemon | undefined
} {
  const index = pokedex.pokemon.findIndex((pokemon) => pokemon.id === id)

  return {
    previous: pokedex.pokemon[index - 1],
    next: index === -1 ? undefined : pokedex.pokemon[index + 1],
  }
}

export function getTrainerById(pokedex: PokedexData, id: number): Trainer | undefined {
  return pokedex.trainers.find((trainer) => trainer.id === id)
}

export function getTrainerTeam(pokedex: PokedexData, trainer: Trainer): readonly Pokemon[] {
  return trainer.pokemonIds.flatMap((id) => {
    const pokemon = getPokemonById(pokedex, id)
    return pokemon === undefined ? [] : [pokemon]
  })
}