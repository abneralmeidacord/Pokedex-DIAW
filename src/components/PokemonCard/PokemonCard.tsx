import { useState } from 'react'
import type { Pokemon, PokemonStats } from '../../types/pokemon'
import { getPokemonImageSource, getPokemonTypeLabel } from '../../utils/pokemonPresentation'
import './PokemonCard.css'

export type PokemonCardProps = {
  pokemon: Pokemon
  imageSrc?: string | null
  onQuickView?: (pokemon: Pokemon) => void
}

const stats: readonly { key: keyof PokemonStats; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Ataque' },
  { key: 'defense', label: 'Defesa' },
  { key: 'specialAttack', label: 'Ataque especial' },
  { key: 'specialDefense', label: 'Defesa especial' },
  { key: 'speed', label: 'Velocidade' },
]

export function PokemonCard({ pokemon, imageSrc = getPokemonImageSource(pokemon.id), onQuickView }: PokemonCardProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const hasImage = Boolean(imageSrc) && failedSource !== imageSrc
  const nameId = `pokemon-${pokemon.id}-name`

  const content = (
    <>
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
      <span className="pokemon-card__name" id={nameId}>{pokemon.name}</span>
      <span className="pokemon-card__types" aria-label="Tipos">
        {pokemon.types.length > 0 ? pokemon.types.map((type) => (
          <span className="pokemon-card__type" data-type={type.id} key={type.id} title={type.name}>
          {getPokemonTypeLabel(type)}
          </span>
        )) : <span className="pokemon-card__type" data-type={0}>Sem tipo</span>}
      </span>
    </>
  )

  return (
    <article className="pokemon-card" aria-labelledby={nameId}>
      {onQuickView ? (
        <button
          type="button"
          className="pokemon-card__summary pokemon-card__trigger"
          aria-label={`Abrir consulta rápida de ${pokemon.name}`}
          aria-haspopup="dialog"
          onClick={(event) => {
            if (event.detail > 1) return
            onQuickView(pokemon)
          }}
        >
          {content}
        </button>
      ) : (
        <details className="pokemon-card__details">
          <summary className="pokemon-card__summary" aria-label={`Ver atributos de ${pokemon.name}`}>
            {content}
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
      )}
    </article>
  )
}
