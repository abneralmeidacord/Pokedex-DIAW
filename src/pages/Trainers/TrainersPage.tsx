import { TrainerCard } from '../../components/TrainerCard/TrainerCard'
import { getTrainerTeam, getTrainers } from '../../services/pokedexService'
import { getTrainerHref } from '../../utils/routes'
import { formatTeamPreview, getTrainerPortraitSource } from '../../utils/trainerPresentation'
import './TrainersPage.css'

const trainers = getTrainers()

export function TrainersPage() {
  return (
    <section className="trainers-page" aria-labelledby="trainers-title">
      <div className="trainers-page__heading">
        <p className="trainers-page__eyebrow">Toda jornada tem seus parceiros</p>
        <h1 id="trainers-title" className="trainers-page__title">
          Conheça os treinadores.
        </h1>
        <p className="trainers-page__description">
          Explore suas insígnias e os Pokémon que fazem parte de cada equipe.
        </p>
      </div>

      <ul className="trainers-page__list" aria-label="Lista de treinadores">
        {trainers.map((trainer) => (
          <li className="trainers-page__item" key={trainer.id}>
            <TrainerCard
              name={trainer.name}
              badges={trainer.badges}
              portraitSrc={getTrainerPortraitSource(trainer.id)}
              teamPreview={formatTeamPreview(getTrainerTeam(trainer).map((pokemon) => pokemon.name))}
              onViewTeam={() => { window.location.hash = getTrainerHref(trainer.id) }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}