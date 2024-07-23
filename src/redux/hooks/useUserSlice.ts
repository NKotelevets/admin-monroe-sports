import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { userSlice } from '@/redux/user/user.slice'

export const useUserSlice = () => {
  const userState = useAppSelector((state) => state.userSlice)
  const dispatch = useAppDispatch()
  const appActions = bindActionCreators(userSlice.actions, dispatch)

  return {
    ...userState,
    ...appActions,
  }
}

