import { useState } from 'react'
import { motion } from 'motion/react'
import { useMotionPreferences } from '../../motion/preferences'
import { getMotionTransition } from '../../motion/settings'
import { Button } from '../../components/Button/Button'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { TrainerCard } from '../../components/TrainerCard/TrainerCard'
import {
  getPokemonById,
  getTrainerTeam,
  getTrainers,
  getTrainersByPokemonId,
} from '../../services/pokedexService'
import { getTrainerHref } from '../../utils/routes'
import { formatTeamPreview, getTrainerPortraitSource } from '../../utils/trainerPresentation'
import './TrainersPage.css'

const trainers = getTrainers()

export function TrainersPage({ pokemonId }: { pokemonId?: number }) {
  const reducedMotion = useMotionPreferences()
  const [query, setQuery] = useState('')

  const isPokemonContext = pokemonId !== undefined

  const pokemon = pokemonId === undefined
    ? undefined
    : getPokemonById(pokemonId)

  const availableTrainers = pokemonId === undefined
    ? trainers
    : getTrainersByPokemonId(pokemonId)

  const term = query.trim().toLowerCase()

  const visibleTrainers = availableTrainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(term)
  )

  return (
    <section className="trainers-page" aria-labelledby="trainers-title">
      <div className="trainers-page__heading">
        <p className="trainers-page__eyebrow">Toda jornada tem seus parceiros</p>
        <h1 id="trainers-title" className="trainers-page__title">
          Conheça os treinadores.
        </h1>
        <p className="trainers-page__description">
          {isPokemonContext
            ? pokemon ? `Treinadores associados a ${pokemon.name}.` : 'Pokémon não encontrado.'
            : 'Explore suas insígnias e os Pokémon que fazem parte de cada equipe.'}
        </p>
        {isPokemonContext && (
          <a className="trainers-page__back" href={pokemon ? `#pokemon/${pokemon.id}` : '#catalogo'}>
            {'\u2190'} {pokemon ? `Voltar para ${pokemon.name}` : 'Voltar à Pokédex'}
          </a>
        )}
      </div>

      <div className="trainers-page__search">
        <SearchBar label="Pesquisar treinador" value={query} onChange={setQuery} />
      </div>

      {visibleTrainers.length === 0 ? (
        <div className="trainers-page__empty" role="status">
          <p className="trainers-page__empty-title">Nenhum treinador encontrado.</p>
          <Button variant="secondary" onClick={() => setQuery('')}>Limpar pesquisa</Button>
        </div>
      ) : (
        <ul className="trainers-page__list" aria-label="Lista de treinadores">
          {visibleTrainers.map((trainer) => (
            <motion.li className="trainers-page__item" key={trainer.id} layout={reducedMotion ? false : 'position'} transition={getMotionTransition(reducedMotion)}>
              <TrainerCard
                name={trainer.name}
                badges={trainer.badges}
                portraitSrc={getTrainerPortraitSource(trainer.id)}
                teamPreview={formatTeamPreview(getTrainerTeam(trainer).map((pokemon) => pokemon.name))}
                onViewTeam={() => { window.location.hash = getTrainerHref(trainer.id) }}
              />
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}
