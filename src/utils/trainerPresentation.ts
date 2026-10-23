const MAX_TEAM_PREVIEW = 3

const trainerPortraits: Readonly<Record<number, string>> = {
  1: '/assets/imgs/trainers/ash.jpg',
  2: '/assets/imgs/trainers/brock.jpg',
  3: '/assets/imgs/trainers/misty.jpg',
  4: '/assets/imgs/trainers/lt-surge.jpg',
  5: '/assets/imgs/trainers/erika.jpg',
  6: '/assets/imgs/trainers/koga.jpg',
  7: '/assets/imgs/trainers/sabrina.jpg',
  8: '/assets/imgs/trainers/blaine.jpg',
  9: '/assets/imgs/trainers/giovanni.jpg',
  10: '/assets/imgs/trainers/gary.jpg',
  11: '/assets/imgs/trainers/team-rocket.png',
  12: '/assets/imgs/trainers/lance.jpg',
}

export function getTrainerPortraitSource(trainerId: number): string | null {
  return trainerPortraits[trainerId] ?? null
}

export function formatBadges(count: number): string {
  return `${count} ${count === 1 ? 'insígnia' : 'insígnias'}`
}

export function formatEarnedBadges(count: number): string {
  return `${count} ${count === 1 ? 'insígnia conquistada' : 'insígnias conquistadas'}`
}

export function formatTeamSize(count: number): string {
  return `${count} Pokémon na equipe`
}

export function formatTeamPreview(names: readonly string[]): string {
  const visible = names.slice(0, MAX_TEAM_PREVIEW).join(' · ')
  const extra = names.length - MAX_TEAM_PREVIEW
  return extra > 0 ? `${visible} +${extra}` : visible
}
