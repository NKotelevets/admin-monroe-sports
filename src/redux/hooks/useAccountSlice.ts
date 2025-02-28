import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { accountSlice } from '@/redux/account/account.slice.tsx'

export const useAccountSlice = () => {
  const state = useAppSelector((state) => state.accountSlice)
  const dispatch = useAppDispatch()
  const actions = bindActionCreators(accountSlice.actions, dispatch)

  return {
    ...state,
    ...actions,
  }
}

