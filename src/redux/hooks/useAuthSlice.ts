import { bindActionCreators } from '@reduxjs/toolkit'

import { authSlice } from '@/redux/auth/auth.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export const useAuthSlice = () => {
  const authState = useAppSelector((state) => state.authSlice)
  const dispatch = useAppDispatch()
  const authActions = bindActionCreators(authSlice.actions, dispatch)

  return {
    ...authState,
    ...authActions,
  }
}

