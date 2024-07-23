import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { authApi } from '@/redux/auth/auth.api'

import { ISignInResponse } from '@/common/interfaces/auth'

interface IAuthSliceState {
  access: string
  refresh: string
  redirectToLogin: boolean
  isUpdatedTokens: boolean
}

const authSliceState: IAuthSliceState = {
  access: '',
  refresh: '',
  redirectToLogin: false,
  isUpdatedTokens: false,
}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState: authSliceState,
  reducers: {
    removeTokens: (state) => {
      state.access = ''
      state.refresh = ''
    },
    updateTokens: (state, action: PayloadAction<ISignInResponse>) => {
      state.access = action.payload.access
      state.refresh = action.payload.refresh
    },
    setRedirectToLogin: (state, action: PayloadAction<boolean>) => {
      state.redirectToLogin = action.payload
    },
    setIsUpdatedTokens: (state, action: PayloadAction<boolean>) => {
      state.isUpdatedTokens = action.payload
    },
  },
  extraReducers: (builder) =>
    builder.addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
      state.access = action.payload.access
      state.refresh = action.payload.refresh
    }),
})

export const { updateTokens, setRedirectToLogin, setIsUpdatedTokens } = authSlice.actions

