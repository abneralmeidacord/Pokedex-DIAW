import { Button } from '../../components/Button/Button'
import { Header } from '../../components/Header/Header'
import './Home.css'

export type HomeProps = {
  onOpenPokedex?: () => ""
}

export function Home({ onOpenPokedex }: HomeProps) {
  return (
    <div className="home">
      <Header />
      <main id="inicio" className="home__main">
        <section className="home__hero" aria-labelledby="home-title">
          <div className="home__copy">
            <div className="home__eyebrow-container">
              <p className="home__eyebrow">Gotta catch them all</p>
            </div>
            <h1 id="home-title" className="home__title">
              Pokedéx
            </h1>
            <h2 id="home-title" className="home__subtitle">
              Sua próxima aventura <br></br>
              começa aqui.
            </h2>
            <p className="home__description">
              Conheça os Pokémon, descubra seus atributos e encontre os parceiros dos seus treinadores favoritos.
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
