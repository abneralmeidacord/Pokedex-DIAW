import { TrainerCard } from '../../components/TrainerCard/TrainerCard'
import { getPokemonById, getTrainersByPokemonId } from '../../services/pokedexService'
import './TrainersPage.css'

export type TrainersPageProps = {
  pokemonId?: number
}

export function TrainersPage({ pokemonId }: TrainersPageProps) {
  const isPokemonContext = pokemonId !== undefined
  const pokemon = isPokemonContext ? getPokemonById(pokemonId) : undefined
  const trainers = pokemon ? getTrainersByPokemonId(pokemon.id) : []

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

      {isPokemonContext ? (
        trainers.length > 0 ? (
          <ul className="trainers-page__list" aria-label={`Treinadores de ${pokemon?.name}`}>
            {trainers.map((trainer) => (
              <li className="trainers-page__item" key={trainer.id}>
                <TrainerCard name={trainer.name} badges={trainer.badges} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="trainers-page__empty">
            {pokemon ? 'Nenhum treinador associado a este Pokémon no catálogo.' : 'Escolha um Pokémon válido para consultar os treinadores.'}
          </p>
        )
      ) : <ul className="trainers-page__list" aria-label="Lista de treinadores">
        
        <li className="trainers-page__item">
          <TrainerCard
            name="Ash"
            badges={9}
            teamPreview="Pikachu · Venusaur · Charizard +3"
            onViewTeam={() => {}}
          />
        </li>
      </ul>}
    </section>
  )
}
