import { Button } from '../../components/Button/Button'
import { Header } from '../../components/Header/Header'
import './Home.css'

export type HomeProps = {
  onOpenPokedex?: () => void
}

export function Home({ onOpenPokedex }: HomeProps) {
  return (
    <div className="home">
      <Header />
      <main id="inicio" className="home__main">
        <section className="home__hero" aria-labelledby="home-title">
          <div className="home__copy">
            <p className="home__eyebrow">Sua jornada começa aqui</p>
            <h1 id="home-title" className="home__title">
              Um mundo de <span>Pokémon</span> para descobrir.
            </h1>
            <p className="home__description">
              Explore Pokémon, conheça seus tipos e habilidades e descubra os
              treinadores que fazem parte desse universo.
            </p>
            <Button className="home__action" onClick={onOpenPokedex} endIcon="→">
              Abrir Pokédex
            </Button>
          </div>

          <div className="home__visual">
            <div className="home__device" role="img" aria-label="Pokédex vermelha fechada">
              <div className="home__device-top" aria-hidden="true">
                <span className="home__lens" />
                <div className="home__indicators">
                  <span className="home__indicator home__indicator--red" />
                  <span className="home__indicator home__indicator--yellow" />
                  <span className="home__indicator home__indicator--green" />
                </div>
              </div>
              <div className="home__device-cover" aria-hidden="true">
                <span className="home__device-label">POKÉDEX</span>
                <span className="home__device-arrow" />
                <div className="home__speaker"><span /><span /><span /></div>
              </div>
              <div className="home__hinge" aria-hidden="true" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
