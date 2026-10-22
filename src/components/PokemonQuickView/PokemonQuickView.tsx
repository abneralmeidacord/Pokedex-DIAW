import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '../Button/Button'
import { PokemonStats } from '../PokemonStats/PokemonStats'
import type { Pokemon } from '../../types/pokemon'
import { getPokemonImageSource, getPokemonTypeColor, getPokemonTypeLabel } from '../../utils/pokemonPresentation'
import './PokemonQuickView.css'

export type PokemonQuickViewProps = {
  isOpen: boolean
  pokemon: Pokemon | null | undefined
  onClose: () => void
  onViewDetails?: (id: number) => void
}

export function PokemonQuickView({ isOpen, pokemon, onClose, onViewDetails }: PokemonQuickViewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pointerStartedOnBackdrop = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const [failedImageSource, setFailedImageSource] = useState<string | null>(null)
  const imageSource = pokemon ? getPokemonImageSource(pokemon.id) : null
  const shouldOpen = isOpen && Boolean(pokemon)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !shouldOpen) return

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
  }, [shouldOpen])

  function isBackdropPoint(dialog: HTMLDialogElement, clientX: number, clientY: number) {
    const bounds = dialog.getBoundingClientRect()
    return clientX < bounds.left || clientX >= bounds.right || clientY < bounds.top || clientY >= bounds.bottom
  }

  if (!pokemon) return null

  return (
    <dialog
      ref={dialogRef}
      className="pokemon-quick-view"
      data-type={pokemon.types[0]?.id ?? 0}
      style={{ '--quick-view-type-color': getPokemonTypeColor(pokemon.types[0]) } as CSSProperties}
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
            <h2 id={titleId} className="pokemon-quick-view__name">{pokemon.name}</h2>
            <span className="pokemon-quick-view__number">#{String(pokemon.id).padStart(3, '0')}</span>
          </div>
          <div className="pokemon-quick-view__types" aria-label="Tipos">
            {pokemon.types.length > 0 ? pokemon.types.map((type) => (
              <span
                key={type.id}
                className="pokemon-quick-view__type"
                data-type={type.id}
                style={{ '--quick-view-type-color': getPokemonTypeColor(type) } as CSSProperties}
              >
                {getPokemonTypeLabel(type)}
              </span>
            )) : <span className="pokemon-quick-view__type">Sem tipo</span>}
          </div>
          {!imageSource || failedImageSource === imageSource ? (
            <div className="pokemon-quick-view__image-fallback" role="img" aria-label={`Imagem de ${pokemon.name} indisponível`}>Sem imagem</div>
          ) : (
            <img
              key={pokemon.id}
              className="pokemon-quick-view__image"
              src={imageSource}
              alt={pokemon.name}
              width={240}
              height={240}
              onError={() => setFailedImageSource(imageSource)}
            />
          )}
        </header>
        <div className="pokemon-quick-view__body">
          <PokemonStats stats={pokemon.stats} />
          <footer className="pokemon-quick-view__footer">
            <Button
              className="pokemon-quick-view__details"
              onClick={onViewDetails ? () => onViewDetails(pokemon.id) : undefined}
              disabled={!onViewDetails}
              title={onViewDetails ? undefined : 'A ficha completa será implementada em uma próxima etapa.'}
              endIcon="→"
            >
              Ver detalhes
            </Button>
            <button type="button" className="pokemon-quick-view__back" onClick={onClose}>Voltar para a lista</button>
          </footer>
        </div>
      </div>
    </dialog>
  )
}
