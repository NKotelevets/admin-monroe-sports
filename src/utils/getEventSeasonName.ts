import { TGetTeamDisplayNameProps } from '@/utils/getTeamName.tsx'
import { eventType } from '@/common/constants/events.ts'

export const getEventSeasonName = (values: Omit<TGetTeamDisplayNameProps, 'masterTeam' | 'league'>): { id?: string, name?: string } => {
  const { event, leagueTeam } = values

  if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
    if (!leagueTeam?.league.name || !leagueTeam?.season?.name) return { id: undefined, name: undefined}
    return {
      id: `${leagueTeam?.season?.id}`,
      name: `${leagueTeam?.league.name} / ${leagueTeam?.season?.name}`,
    }
  }

  return { id: undefined, name: undefined}
}
