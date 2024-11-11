import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { leagueTeamsSlice } from '@/redux/leagueTeams/leagueTeams.slice'

export const useLeagueTeamsSlice = () => {
  const state = useAppSelector((state) => state.leagueTeamsSlice)
  const dispatch = useAppDispatch()
  const actions = bindActionCreators(leagueTeamsSlice.actions, dispatch)

  return {
    ...state,
    ...actions,
  }
}

