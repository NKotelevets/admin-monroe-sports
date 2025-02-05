import { eventType } from '@/common/constants/events'
import { IEvent } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IFESeason } from '@/common/interfaces/season.ts'

export type TGetTeamDisplayNameProps = {
  event: IEvent
  masterTeam?: IFEMasterTeam
  leagueTeam?: IFELeagueTeam
  league?: IFESeason
}

/**
 * Determines and returns the appropriate team name for the given event type.
 *
 * The function evaluates the event type and returns the corresponding team name
 * based on the provided values. It considers different event types such as GAME,
 * PLAYOFF, and others, and handles each case accordingly.
 *
 * @function
 * @param {TGetTeamDisplayNameProps} values - Object containing event, masterTeam, and leagueTeam information.
 * @param {Object} values.event - The event object containing type and additional event details.
 * @param {Object} values.masterTeam - The master team object containing name and other details.
 * @param {Object} values.leagueTeam - The league team object containing name and other details.
 * @return {string} The name of the team to be displayed or a fallback value ('---').
 */
export const getEventTeamName = (values: TGetTeamDisplayNameProps): string => {
  const { event, masterTeam, leagueTeam } = values

  // if event is GAME, league team name is displayed
  if (event.type === eventType.GAME) {
    return leagueTeam?.name || '---'
  }

  // if event is PLAYOFF and brackets are populated, league team name is displayed
  if (event.type === eventType.PLAYOFF && event.playoffInfo) {
    return leagueTeam?.name || '---'
  }

  // if event is PLAYOFF and brackets aren't populated, subdivision name is displayed
  if (event.type === eventType.PLAYOFF && !event.playoffInfo) {
    return event.subDivision?.name || '---' // FIXME: this should be checked when working with playoffs
  }

  // if event is OTHER or PRACTICE, master team name is displayed
  return masterTeam?.name || '---'
}
