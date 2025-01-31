import {
  BEST_RECORD_WINS,
  LEAGUE,
  POINTS,
  SINGLE_ELIMINATION_BRACKET,
  TOURN,
  WINNING
} from '@/common/constants/league.ts'
import { IBELeague } from '@/common/interfaces/league.ts'

export const leagueResponseMapper = (league: IBELeague) => ({
  id: league.id,
  type: league.type === 0 ? LEAGUE : TOURN,
  name: league.name,
  description: league.description,
  updatedAt: league.updated_at,
  createdAt: league.created_at,
  playoffFormat: league.playoff_format === 0 ? BEST_RECORD_WINS : SINGLE_ELIMINATION_BRACKET,
  standingsFormat: league.standings_format === 0 ? WINNING : POINTS,
  tiebreakersFormat: league.tiebreakers_format === 0 ? WINNING : POINTS,
  playoffsTeams: league.playoffs_teams,
  minAttendance: league.min_attendance,
  welcomeNote: league.welcome_note,
  seasons: league.league_seasons.map((season) => ({
    id: season.id,
    name: season.name
  }))
})
