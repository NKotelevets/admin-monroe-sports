import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { leaguesSlice } from '@/redux/leagues/leagues.slice'

export const useLeagueSlice = () => {
  const dispatch = useDispatch()
  const leagueState = useAppSelector((state) => state.leaguesSlice)
  const leagueActions = bindActionCreators(leaguesSlice.actions, dispatch)

  return {
    ...leagueState,
    ...leagueActions,
  }
}
