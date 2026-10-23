import { useState } from 'react'
import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { Button } from '../../components/Button/Button'
import { PokemonStats } from '../../components/PokemonStats/PokemonStats'
import { getPokemonById, getPokemonNeighbors } from '../../services/pokedexService'
import { getPokemonImageSource, getPokemonTypeColor, getPokemonTypeLabel } from '../../utils/pokemonPresentation'
import { useMotionPreferences } from '../../motion/preferences'
import { MOTION } from '../../motion/settings'
import pokeballDetail from '../../assets/figma/pokeball-detail.svg'
import bulbasaurDetail from '../../assets/figma/bulbasaur-detail.png'
import './PokemonDetails.css'

export type PokemonDetailsProps = {
  pokemonId: number
}

export function PokemonDetails({ pokemonId }: PokemonDetailsProps) {
  const reducedMotion = useMotionPreferences()
  const pokemon = Number.isSafeInteger(pokemonId) && pokemonId > 0 ? getPokemonById(pokemonId) : undefined
  const [failedImageSource, setFailedImageSource] = useState<string | null>(null)

  if (!pokemon) {
    return (
      <section className="pokemon-details pokemon-details--missing" aria-labelledby="pokemon-details-title">
        <h1 id="pokemon-details-title">Pokémon não encontrado</h1>
        <p>Não encontramos um Pokémon com esse ID na Pokédex.</p>
        <Button href="#catalogo" variant="secondary">← Voltar à Pokédex</Button>
      </section>
    )
  }

  const imageSource = pokemon.id === 1 ? bulbasaurDetail : getPokemonImageSource(pokemon.id)
  const { previous, next } = getPokemonNeighbors(pokemon.id)

  return (
    <section
      className="pokemon-details"
      aria-labelledby="pokemon-details-title"
      data-type={pokemon.types[0]?.id ?? 0}
      style={{ '--pokemon-detail-type-color': getPokemonTypeColor(pokemon.types[0]) } as CSSProperties}
    >
      <a className="pokemon-details__back" href="#catalogo">←&nbsp; Voltar à Pokédex</a>
      <div className="pokemon-details__layout">
        <div className="pokemon-details__portrait">
          <span className="pokemon-details__watermark" aria-hidden="true">{pokemon.name}</span>
          <p className="pokemon-details__number">#{String(pokemon.id).padStart(3, '0')}</p>
          <img className="pokemon-details__pokeball" src={pokeballDetail} alt="" aria-hidden="true" width={440} height={440} />
          {failedImageSource === imageSource ? (
            <div className="pokemon-details__image pokemon-details__image--missing" role="img" aria-label={`Imagem de ${pokemon.name} indisponível`}>Sem imagem</div>
          ) : (
            <motion.img
              className="pokemon-details__image"
              src={imageSource}
              alt={pokemon.name}
              width={440}
              height={409}
              style={{ x: '-50%' }}
              initial={false}
              animate={{ y: reducedMotion ? 0 : [0, -MOTION.distance.float, 0] }}
              transition={reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.float, repeat: Infinity, ease: 'easeInOut' }}
              onError={() => setFailedImageSource(imageSource)}
            />
          )}
          <div className="pokemon-details__identity">
            <h1 id="pokemon-details-title">{pokemon.name}</h1>
            <div className="pokemon-details__types" aria-label="Tipos">
              {pokemon.types.map((type) => (
                <span
                  className="pokemon-details__type"
                  key={type.id}
                  data-type={type.id}
                  style={{ '--pokemon-detail-badge-color': getPokemonTypeColor(type) } as CSSProperties}
                >
                  {getPokemonTypeLabel(type)}
                </span>
              ))}
              {pokemon.types.length === 0 && <span className="pokemon-details__type">Sem tipo</span>}
            </div>
          </div>
        </div>
        <div className="pokemon-details__information">
          <p className="pokemon-details__eyebrow">Conheça seu parceiro</p>
          <h2 className="pokemon-details__heading">Pequeno no tamanho.<br />Grande no potencial.</h2>
          <p className="pokemon-details__description">Consulte os seis atributos base de {pokemon.name} e descubra os treinadores associados a ele.</p>
          <PokemonStats stats={pokemon.stats} variant="detail" />
          <Button className="pokemon-details__trainers" variant="secondary" endIcon={'\u2192'} href={`#treinadores?pokemon=${pokemon.id}`}>
            Conhecer os treinadores
          </Button>
        </div>
      </div>
      <nav className="pokemon-details__pagination" aria-label="Navegar entre Pokémon">
        {previous ? (
          <Button className="pokemon-details__previous" variant="secondary" href={`#pokemon/${previous.id}`} rel="prev" aria-label={`Pokémon anterior: ${previous.name}`}>
            <span aria-hidden="true">{'\u2190'}</span> {previous.name}
          </Button>
        ) : (
          <Button className="pokemon-details__previous" variant="secondary" disabled>
            <span aria-hidden="true">{'\u2190'}</span> Anterior
          </Button>
        )}
        {next ? (
          <Button className="pokemon-details__next" variant="secondary" href={`#pokemon/${next.id}`} rel="next" endIcon={'\u2192'} aria-label={`Próximo Pokémon: ${next.name}`}>
            {next.name}
          </Button>
        ) : (
          <Button className="pokemon-details__next" variant="secondary" endIcon={'\u2192'} disabled>Próximo</Button>
        )}
      </nav>
    </section>
  )
}
