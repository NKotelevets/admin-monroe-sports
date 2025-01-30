import { accountSlice } from '@/redux/account/account.slice.tsx'
import { accountApi } from '@/redux/account/account.api.ts'

export const accountReducer = {
  [accountSlice.name]: accountSlice.reducer,
  [accountApi.reducerPath]: accountApi.reducer
}

