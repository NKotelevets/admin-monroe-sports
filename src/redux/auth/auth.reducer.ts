import { authApi } from '@/redux/auth/auth.api'
import { authSlice } from '@/redux/auth/auth.slice'

export const authReducer = {
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
}

