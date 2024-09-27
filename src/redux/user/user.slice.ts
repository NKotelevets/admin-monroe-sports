import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { userApi } from '@/redux/user/user.api'

import { IBlockedUserError, IFEUser } from '@/common/interfaces/user'

interface IUserSliceState {
  user: IFEUser | null
  limit: number
  offset: number
  users: IFEUser[]
  total: number
  ordering: string
  createdRecordsNames: { name: string; showIcon: boolean }[]
  selectedRecords: IFEUser[]
  isCreateOperatorScreen: boolean
  blockedUserErrors: IBlockedUserError[]
}

const userSliceState: IUserSliceState = {
  user: null,
  limit: 10,
  offset: 0,
  users: [],
  total: 0,
  ordering: '',
  createdRecordsNames: [],
  selectedRecords: [],
  isCreateOperatorScreen: false,
  blockedUserErrors: [],
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: userSliceState,
  reducers: {
    clearUserData: (state) => {
      state.user = null
    },
    setPaginationParams: (
      state,
      action: PayloadAction<{
        limit: number
        offset: number
        ordering?: string
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering || ''
    },
    setRecords: (state, action: PayloadAction<IFEUser[]>) => {
      state.selectedRecords = action.payload
    },
    setIsCreateOperatorScreen: (state, action: PayloadAction<boolean>) => {
      state.isCreateOperatorScreen = action.payload
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user = action.payload
      })
      .addMatcher(userApi.endpoints.getUsers.matchFulfilled, (state, action) => {
        state.users = action.payload.data
        state.total = action.payload.count
      })
      .addMatcher(userApi.endpoints.bulkBlockUsers.matchFulfilled, (state, action) => {
        state.blockedUserErrors = action.payload.items
      }),
})
