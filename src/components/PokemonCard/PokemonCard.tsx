import { useState } from 'react'
import type { Pokemon, PokemonStats } from '../../types/pokemon'
import './PokemonCard.css'

export type PokemonCardProps = {
  pokemon: Pokemon
  imageSrc?: string | null
}

const typeLabels: Readonly<Record<number, string>> = {
  0: 'Sem tipo', 1: 'Normal', 2: 'Fogo', 3: 'Água', 4: 'Planta',
  5: 'Elétrico', 6: 'Gelo', 7: 'Lutador', 8: 'Veneno', 9: 'Terra',
  10: 'Voador', 11: 'Psíquico', 12: 'Inseto', 13: 'Pedra',
  14: 'Fantasma', 15: 'Sombrio', 16: 'Dragão', 17: 'Aço',
}

const stats: readonly { key: keyof PokemonStats; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defesa' },
  { key: 'specialAttack', label: 'Ataque especial' },
  { key: 'specialDefense', label: 'Defesa especial' },
  { key: 'speed', label: 'Velocidade' },
]

// https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
function getImageSource(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function PokemonCard({ pokemon, imageSrc = getImageSource(pokemon.id) }: PokemonCardProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const hasImage = Boolean(imageSrc) && failedSource !== imageSrc
  const nameId = `pokemon-${pokemon.id}-name`

  return (
    <article className="pokemon-card" aria-labelledby={nameId}>
      <details className="pokemon-card__details">
        <summary className="pokemon-card__summary" aria-label={`Ver atributos de ${pokemon.name}`}>
          <span className="pokemon-card__id">#{String(pokemon.id).padStart(3, '0')}</span>
          {hasImage && imageSrc ? (
            <img
              className="pokemon-card__image"
              src={imageSrc}
              alt={pokemon.name}
              width={144}
              height={144}
              loading="lazy"
              decoding="async"
              onError={() => setFailedSource(imageSrc)}
            />
          ) : (
            <span className="pokemon-card__fallback" role="img" aria-label={`Imagem de ${pokemon.name} indisponível`}>
              <span className="pokemon-card__fallback-mark" aria-hidden="true">?</span>
              <span aria-hidden="true">Sem imagem</span>
            </span>
          )}
          <h3 className="pokemon-card__name" id={nameId}>{pokemon.name}</h3>
          <span className="pokemon-card__types" aria-label="Tipos">
            {pokemon.types.length > 0 ? pokemon.types.map((type) => (
              <span className="pokemon-card__type" data-type={type.id} key={type.id} title={type.name}>
                {typeLabels[type.id] ?? type.name}
              </span>
            )) : <span className="pokemon-card__type" data-type={0}>Sem tipo</span>}
          </span>
        </summary>
        <dl className="pokemon-card__stats" aria-label={`Atributos de ${pokemon.name}`}>
          {stats.map(({ key, label }) => (
            <div className="pokemon-card__stat" key={key}>
              <dt>{label}</dt>
              <dd>{pokemon.stats[key]}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  )
}
