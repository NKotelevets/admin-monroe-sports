import { bindActionCreators } from '@reduxjs/toolkit'

import { appSlice } from '@/redux/app/app.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export const useAppSlice = () => {
  const appState = useAppSelector((state) => state.appSlice)
  const dispatch = useAppDispatch()
  const appActions = bindActionCreators(appSlice.actions, dispatch)

  return {
    ...appState,
    ...appActions,
  }
}

