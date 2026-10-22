import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '../Button/Button'
import './PokemonQuickView.css'

export type PokemonQuickViewProps = {
  isOpen: boolean
  onClose: () => void
  onViewDetails?: () => void
}

const exampleStats = [
  { label: 'HP', value: 45, color: '#e7474e' },
  { label: 'Ataque', value: 49, color: '#ad442d' },
  { label: 'Defesa', value: 49, color: '#886615' },
  { label: 'Ataque especial', value: 65, color: '#365f99' },
  { label: 'Defesa especial', value: 65, color: '#287566' },
  { label: 'Velocidade', value: 45, color: '#805399' },
] as const

// Exemplo fixo do protótipo; a conexão com o Pokémon selecionado vem depois.
const exampleImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'

export function PokemonQuickView({ isOpen, onClose, onViewDetails }: PokemonQuickViewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pointerStartedOnBackdrop = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = document.documentElement
    const body = document.body
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousBodyPadding = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - root.clientWidth

    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`
    }

    pointerStartedOnBackdrop.current = false
    dialog.showModal()
    dialog.scrollTop = 0
    closeButtonRef.current?.focus({ preventScroll: true })

    function containFocus(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !dialog) return

      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]

      if (!first || !last) {
        event.preventDefault()
        dialog.focus()
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', containFocus)

    return () => {
      dialog.removeEventListener('keydown', containFocus)
      if (dialog.open) dialog.close()
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
      body.style.paddingRight = previousBodyPadding
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [isOpen])

  function isBackdropPoint(dialog: HTMLDialogElement, clientX: number, clientY: number) {
    const bounds = dialog.getBoundingClientRect()
    return clientX < bounds.left || clientX >= bounds.right || clientY < bounds.top || clientY >= bounds.bottom
  }

  return (
    <dialog
      ref={dialogRef}
      className="pokemon-quick-view"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      onPointerDown={(event) => {
        pointerStartedOnBackdrop.current = event.target === event.currentTarget && isBackdropPoint(event.currentTarget, event.clientX, event.clientY)
      }}
      onPointerCancel={() => { pointerStartedOnBackdrop.current = false }}
      onClick={(event) => {
        const shouldClose = pointerStartedOnBackdrop.current && event.target === event.currentTarget && isBackdropPoint(event.currentTarget, event.clientX, event.clientY)
        pointerStartedOnBackdrop.current = false
        if (shouldClose) onClose()
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="pokemon-quick-view__panel">
        <header className="pokemon-quick-view__hero">
          <div className="pokemon-quick-view__topline">
            <p id={descriptionId} className="pokemon-quick-view__eyebrow">Consulta rápida</p>
            <button ref={closeButtonRef} type="button" className="pokemon-quick-view__close" aria-label="Fechar consulta rápida" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="pokemon-quick-view__heading">
            <h2 id={titleId} className="pokemon-quick-view__name">Bulbasaur</h2>
            <span className="pokemon-quick-view__number">#001</span>
          </div>
          <div className="pokemon-quick-view__types" aria-label="Tipos">
            <span className="pokemon-quick-view__type">Planta</span>
            <span className="pokemon-quick-view__type pokemon-quick-view__type--poison">Veneno</span>
          </div>
          {imageFailed ? (
            <div className="pokemon-quick-view__image-fallback" role="img" aria-label="Imagem de Bulbasaur indisponível">Sem imagem</div>
          ) : (
            <img className="pokemon-quick-view__image" src={exampleImage} alt="Bulbasaur" width={240} height={240} onError={() => setImageFailed(true)} />
          )}
        </header>
        <div className="pokemon-quick-view__body">
          <section aria-labelledby={`${titleId}-stats`}>
            <h3 id={`${titleId}-stats`} className="pokemon-quick-view__stats-title">Atributos base</h3>
            <dl className="pokemon-quick-view__stats">
              {exampleStats.map(({ label, value, color }) => (
                <div className="pokemon-quick-view__stat" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                  <div className="pokemon-quick-view__track" aria-hidden="true">
                    <span style={{ width: `${value / 150 * 100}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </dl>
          </section>
          <footer className="pokemon-quick-view__footer">
            <Button className="pokemon-quick-view__details" onClick={onViewDetails} disabled={!onViewDetails} title={onViewDetails ? undefined : 'A ficha completa será implementada em uma próxima etapa.'} endIcon="→">
              Ver detalhes
            </Button>
            <button type="button" className="pokemon-quick-view__back" onClick={onClose}>Voltar para a lista</button>
          </footer>
        </div>
      </div>
    </dialog>
  )
}
