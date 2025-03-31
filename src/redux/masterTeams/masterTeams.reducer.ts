import { masterTeamsApi } from '@/redux/masterTeams/masterTeams.api'
import { masterTeamsSlice } from '@/redux/masterTeams/masterTeams.slice'

export const masterTeamsReducer = {
  [masterTeamsSlice.name]: masterTeamsSlice.reducer,
  [masterTeamsApi.reducerPath]: masterTeamsApi.reducer,
}

