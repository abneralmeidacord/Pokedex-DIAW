import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import './PokedexCover.css'

export type PokedexCoverState = 'closed' | 'opening' | 'open'

export type PokedexCoverProps = {
  state: PokedexCoverState
  onOpen: () => void
  onOpeningComplete: () => void
  onReady: () => void
}

// Adaptado de PokedexCover, do professor João Paulo Aramuni:
// https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex/src/components/PokedexCover
const lidVariants: Variants = {
  closed: { rotateY: 0, opacity: 1 },
  opening: {
    rotateY: 105,
    opacity: [1, 1, 0],
    transition: { duration: 0.75, ease: [0.55, 0, 0.3, 1], opacity: { times: [0, 0.85, 1] } },
  },
  open: { rotateY: 105, opacity: 0, transition: { duration: 0 } },
}

const lensVariants: Variants = {
  off: { opacity: 0 },
  ready: { opacity: [0, 1, 0.75], transition: { duration: 0.55 } },
}

export function PokedexCover({ state, onOpen, onOpeningComplete, onReady }: PokedexCoverProps) {
  const isOpen = state === 'open'

  return (
    <div className="pokedex-cover" data-state={state} aria-busy={state !== 'closed'}>
      <button
        className="pokedex-cover__device"
        type="button"
        onClick={onOpen}
        disabled={state !== 'closed'}
        aria-label="Abrir Pokédex pelo dispositivo"
      >
        <img
          className="pokedex-cover__image"
          src={`${import.meta.env.BASE_URL}assets/imgs/pokedex-open.png`}
          alt=""
          width={1638}
          height={2058}
          draggable={false}
        />
        <motion.span
          className="pokedex-cover__lens"
          aria-hidden="true"
          initial={false}
          animate={isOpen ? 'ready' : 'off'}
          variants={lensVariants}
          onAnimationComplete={(definition) => { if (definition === 'ready') onReady() }}
        />
        <motion.span
          className="pokedex-cover__led"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: isOpen ? [0, 1, 0.5, 1] : 0 }}
          transition={{ duration: 0.5 }}
        />
        <span className="pokedex-cover__scan" aria-hidden="true">
          <motion.span initial={false} animate={{ x: isOpen ? '460%' : '0%' }} transition={{ duration: 0.5, ease: 'easeInOut' }} />
        </span>
        <motion.img
          className="pokedex-cover__lid"
          src={`${import.meta.env.BASE_URL}assets/imgs/pokedex-closed.png`}
          alt=""
          width={1638}
          height={2058}
          draggable={false}
          initial={false}
          animate={state}
          variants={lidVariants}
          onAnimationComplete={(definition) => { if (definition === 'opening') onOpeningComplete() }}
        />
      </button>
      <p className="pokedex-cover__status" role="status">
        {state === 'opening' ? 'Abrindo a Pokédex...' : isOpen ? 'Iniciando a Pokédex...' : ''}
      </p>
    </div>
  )
}
