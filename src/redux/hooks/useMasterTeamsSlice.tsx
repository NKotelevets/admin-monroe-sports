import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { masterTeamsSlice } from '@/redux/masterTeams/masterTeams.slice'

export const useMasterTeamsSlice = () => {
  const state = useAppSelector((state) => state.masterTeamsSlice)
  const dispatch = useAppDispatch()
  const actions = bindActionCreators(masterTeamsSlice.actions, dispatch)

  return {
    ...state,
    ...actions,
  }
}

