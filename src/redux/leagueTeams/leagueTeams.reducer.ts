import { leagueTeamsApi } from '@/redux/leagueTeams/leagueTeams.api'
import { leagueTeamsSlice } from '@/redux/leagueTeams/leagueTeams.slice'

export const leagueTeamsReducer = {
  [leagueTeamsSlice.name]: leagueTeamsSlice.reducer,
  [leagueTeamsApi.reducerPath]: leagueTeamsApi.reducer,
}

