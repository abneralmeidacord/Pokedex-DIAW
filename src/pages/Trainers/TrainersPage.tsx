import { TrainerCard } from '../../components/TrainerCard/TrainerCard'
import './TrainersPage.css'

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
        
        <li className="trainers-page__item">
          <TrainerCard
            name="Ash"
            badges={9}
            teamPreview="Pikachu · Venusaur · Charizard +3"
            onViewTeam={() => {}}
          />
        </li>
      </ul>
    </section>
  )
}