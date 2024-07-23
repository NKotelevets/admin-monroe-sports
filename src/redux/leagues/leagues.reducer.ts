import { leaguesApi } from '@/redux/leagues/leagues.api'
import { leaguesSlice } from '@/redux/leagues/leagues.slice'

export const leaguesReducer = {
  [leaguesApi.reducerPath]: leaguesApi.reducer,
  [leaguesSlice.name]: leaguesSlice.reducer,
}

