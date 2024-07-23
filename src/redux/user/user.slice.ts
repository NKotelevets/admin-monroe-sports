import { createSlice } from '@reduxjs/toolkit'

import { userApi } from '@/redux/user/user.api'

import { IUser } from '@/common/interfaces/user'

interface IUserSliceState {
  user: IUser | null
}

const userSliceState: IUserSliceState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: userSliceState,
  reducers: {
    clearUserData: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, action) => {
      state.user = action.payload
    }),
})

