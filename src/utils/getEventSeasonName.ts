import { TGetTeamDisplayNameProps } from '@/utils/getTeamName.tsx'
import { eventType } from '@/common/constants/events.ts'
import { EMPTY_VALUE } from '@/common/constants'

export const getEventSeasonName = (values: Omit<TGetTeamDisplayNameProps, 'masterTeam' | 'league'>) => {
  const { event, leagueTeam } = values

  if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
    if (!leagueTeam?.league.name) return EMPTY_VALUE
    return `${leagueTeam?.league.name} / ${leagueTeam?.season?.name}`
  }

  return EMPTY_VALUE
}
