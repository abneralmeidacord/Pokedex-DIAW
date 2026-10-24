import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { CSSProperties, RefObject } from 'react'
import { Button } from '../Button/Button'
import { PokemonStats } from '../PokemonStats/PokemonStats'
import type { Pokemon } from '../../types/pokemon'
import { getPokemonImageSource, getPokemonTypeColor, getPokemonTypeLabel } from '../../utils/pokemonPresentation'
import { useMotionPreferences } from '../../motion/preferences'
import { getMotionTransition, MOTION } from '../../motion/settings'
import './PokemonQuickView.css'

export type PokemonQuickViewProps = {
  isOpen: boolean
  pokemon: Pokemon | null | undefined
  onClose: () => void
  onViewDetails?: (id: number) => void
  onExitComplete?: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function PokemonQuickView({ isOpen, pokemon, onClose, onViewDetails, onExitComplete, returnFocusRef }: PokemonQuickViewProps) {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && pokemon && (
        <QuickViewDialog key="pokemon-quick-view" pokemon={pokemon} onClose={onClose} onViewDetails={onViewDetails} returnFocusRef={returnFocusRef} />
      )}
    </AnimatePresence>
  )
}

type QuickViewDialogProps = {
  pokemon: Pokemon
  onClose: () => void
  onViewDetails?: (id: number) => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

const waveFrames = [
  'M0 0 H430 V16 C350 36 290 -4 215 16 C140 36 70 -4 0 16 Z',
  'M0 0 H430 V20 C350 -4 290 36 215 20 C140 -4 70 36 0 20 Z',
  'M0 0 H430 V16 C350 36 290 -4 215 16 C140 36 70 -4 0 16 Z',
]

function QuickViewDialog({ pokemon, onClose, onViewDetails, returnFocusRef }: QuickViewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const latestReturnTarget = useRef<HTMLElement | null>(null)
  const isPresent = useIsPresent()
  const reducedMotion = useMotionPreferences()
  const pointerStartedOnBackdrop = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const [failedImageSource, setFailedImageSource] = useState<string | null>(null)
  const imageSource = getPokemonImageSource(pokemon.id)

  useLayoutEffect(() => {
    if (returnFocusRef?.current) latestReturnTarget.current = returnFocusRef.current
    if (!isPresent) dialogRef.current?.focus({ preventScroll: true })
    else if (dialogRef.current?.open) closeButtonRef.current?.focus({ preventScroll: true })
  }, [isPresent, pokemon.id, returnFocusRef])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

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
      )).filter((element) => !element.closest('[inert]') && element.getClientRects().length > 0)
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
      const returnTarget = latestReturnTarget.current ?? trigger
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true })
    }
  }, [returnFocusRef])

  return (
    <dialog
      ref={dialogRef}
      className="pokemon-quick-view"
      data-type={pokemon.types[0]?.id ?? 0}
      style={{ '--quick-view-type-color': getPokemonTypeColor(pokemon.types[0]) } as CSSProperties}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      data-state={isPresent ? 'open' : 'closing'}
      onPointerDown={(event) => {
        pointerStartedOnBackdrop.current = event.target === event.currentTarget || event.target === overlayRef.current
      }}
      onPointerCancel={() => { pointerStartedOnBackdrop.current = false }}
      onClick={(event) => {
        const shouldClose = pointerStartedOnBackdrop.current && (event.target === event.currentTarget || event.target === overlayRef.current)
        pointerStartedOnBackdrop.current = false
        if (isPresent && shouldClose) onClose()
      }}
      onCancel={(event) => {
        event.preventDefault()
        if (isPresent) onClose()
      }}
    >
      <motion.div
        ref={overlayRef}
        className="pokemon-quick-view__overlay"
        aria-hidden="true"
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={getMotionTransition(reducedMotion)}
      />
      <motion.div
        className="pokemon-quick-view__surface"
        initial={{ x: reducedMotion ? 0 : -MOTION.distance.panel }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: reducedMotion ? 0 : -MOTION.distance.panel, opacity: 0 }}
        transition={getMotionTransition(reducedMotion, MOTION.duration.panel)}
        inert={!isPresent}
        aria-hidden={!isPresent || undefined}
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
            <svg className="pokemon-quick-view__wave" viewBox="0 0 430 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <motion.path
                initial={{ d: waveFrames[0] }}
                animate={{ d: reducedMotion || !isPresent ? waveFrames[0] : waveFrames }}
                transition={reducedMotion || !isPresent
                  ? { duration: 0 }
                  : { duration: MOTION.duration.wave, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
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
      </motion.div>
    </dialog>
  )
}
