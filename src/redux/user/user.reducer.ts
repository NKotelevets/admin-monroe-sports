import { userApi } from '@/redux/user/user.api'
import { userSlice } from '@/redux/user/user.slice'

export const userReducer = {
  [userApi.reducerPath]: userApi.reducer,
  [userSlice.name]: userSlice.reducer,
}

