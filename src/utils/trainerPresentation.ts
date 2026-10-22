const MAX_TEAM_PREVIEW = 3

const trainerPortraits: Readonly<Record<number, string>> = {}

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