import { eventType } from '@/common/constants/events.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { IFESeason } from '@/common/interfaces/season.ts'
import { PATH_TO_LEAGUE_TEAMS, PATH_TO_MASTER_TEAMS, PATH_TO_SEASONS } from '@/common/constants/paths.ts'
import { IFESubdivision } from '@/common/interfaces/division.ts'

type TGetTeamDisplayNameProps = {
  event: IEvent
  masterTeam?: IFEMasterTeam
  leagueTeam?: IFELeagueTeam
  league?: IFESeason
}

export const getTeamAdmin = (data: IEvent, team: IFELeagueTeam | undefined | IFESubdivision | IFEMasterTeam) => {
  const type = eventTeamType(data)

  if (type === 'masterTeam') {
    return (team as IFEMasterTeam)?.teamAdmins
  }

  if (type === 'leagueTeam') {
    return (team as IFELeagueTeam)?.masterTeam?.teamAdmins
  }

  return undefined // FIXME: this is where playoffs will end up
}

export const eventTeamType = (event: IEvent) => {

  // if event is GAME, league team name is displayed
  if (event.type === eventType.GAME || (event.type === eventType.PLAYOFF && event.playoffInfo)) {
    return 'leagueTeam'
  }

  // if event is PLAYOFF and brackets aren't populated, subdivision name is displayed
  if (event.type === eventType.PLAYOFF && !event.playoffInfo) {
    return 'subDivision' // FIXME: this should be checked when working with playoffs
  }

  return 'masterTeam'
}

export const getTeam = (values: TGetTeamDisplayNameProps) => {
  const {
    event,
    masterTeam,
    leagueTeam
  } = values

  const teamType = eventTeamType(event)

  if (teamType === 'leagueTeam') {
    return leagueTeam
  }

  if (teamType === 'subDivision') {
    return event.subDivision // FIXME: this should be checked when working with playoffs
  }

  // if event is OTHER or PRACTICE, master team name is displayed
  return masterTeam
}

export const getTeamHeadCoach = (values: Omit<TGetTeamDisplayNameProps, 'league'>) => {
  const {
    event,
    masterTeam,
    leagueTeam
  } = values

  if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
    if (!leagueTeam?.headCoach?.firstName) return undefined
    return leagueTeam?.headCoach
  }

  if (!masterTeam?.headCoach?.firstName) return undefined
  return masterTeam?.headCoach
}

export const getSeason = (values: Omit<TGetTeamDisplayNameProps, 'masterTeam' | 'league'>) => {
  const {
    event,
    leagueTeam
  } = values

  if (event.type === eventType.GAME || event.type === eventType.PLAYOFF) {
    if (!leagueTeam?.league.name) return undefined
    return leagueTeam?.league
  }

  return undefined
}

export const getTeamUrl = (event: IEvent) => {
  const type = eventTeamType(event)
  if (type === 'masterTeam') {
    return PATH_TO_MASTER_TEAMS
  }

  if (type === 'leagueTeam') {
    return PATH_TO_LEAGUE_TEAMS
  }

 return PATH_TO_SEASONS
}
