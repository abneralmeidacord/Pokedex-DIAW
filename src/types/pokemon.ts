export type PokemonStats = {
  readonly hp: number
  readonly attack: number
  readonly defense: number
  readonly specialAttack: number
  readonly specialDefense: number
  readonly speed: number
}

export type PokemonType = {
  readonly id: number
  readonly name: string
}

export type Pokemon = {
  readonly id: number
  readonly name: string
  readonly stats: PokemonStats
  readonly types: readonly PokemonType[]
}

export type Trainer = {
  readonly id: number
  readonly name: string
  readonly badges: number
  readonly pokemonIds: readonly number[]
}

export type PokedexData = {
  readonly types: readonly PokemonType[]
  readonly pokemon: readonly Pokemon[]
  readonly trainers: readonly Trainer[]
}
