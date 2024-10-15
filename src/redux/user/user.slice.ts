import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { userApi } from '@/redux/user/user.api'

import {
  IBlockedUserError,
  IBulkEditError,
  IBulkEditFEUser,
  IExtendedFEUser,
  IFEDuplicateWithIdx,
  IImportUsersCSVTableData,
} from '@/common/interfaces/user'

interface IUserSliceState {
  user: IExtendedFEUser | null
  limit: number
  offset: number
  users: IExtendedFEUser[]
  total: number
  ordering: string
  createdUsersIds: string[]
  selectedRecords: IBulkEditFEUser[]
  isCreateOperatorScreen: boolean
  blockedUserErrors: IBlockedUserError[]
  editUsersErrors: IBulkEditError[]
  importCSVTableRecords: IImportUsersCSVTableData[]
  duplicates: IFEDuplicateWithIdx[]
}

const userSliceState: IUserSliceState = {
  user: null,
  limit: 10,
  offset: 0,
  users: [],
  total: 0,
  ordering: '',
  createdUsersIds: [],
  selectedRecords: [],
  isCreateOperatorScreen: false,
  blockedUserErrors: [],
  editUsersErrors: [],
  importCSVTableRecords: [],
  duplicates: [],
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
    setRecords: (state, action: PayloadAction<IBulkEditFEUser[]>) => {
      state.selectedRecords = action.payload
    },
    setIsCreateOperatorScreen: (state, action: PayloadAction<boolean>) => {
      state.isCreateOperatorScreen = action.payload
    },
    setEditUsersErrors: (state, action: PayloadAction<IBulkEditError[]>) => {
      state.editUsersErrors = action.payload
    },
    removeDuplicate: (state, action: PayloadAction<number>) => {
      const remainingDuplicates = state.duplicates.filter((duplicate) => duplicate.idx !== action.payload)
      const remainingTableRecords = state.importCSVTableRecords.filter(
        (tableRecord) => tableRecord.idx !== action.payload,
      )
      const updatedDuplicates = remainingDuplicates.map((tR, idx) => ({ ...tR, index: idx }))
      const updatedTableRecords = remainingTableRecords.map((tR, idx) => ({ ...tR, idx }))

      state.duplicates = updatedDuplicates
      state.importCSVTableRecords = updatedTableRecords
    },
    removeCreatedUsersIds: (state) => {
      state.createdUsersIds = []
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
      })
      .addMatcher(userApi.endpoints.importUsersCSV.matchFulfilled, (state, action) => {
        state.createdUsersIds = action.payload.success

        state.duplicates = action.payload?.duplicates
          ? action.payload.duplicates.map((duplicate, idx) => ({
              idx,
              ...duplicate,
            }))
          : []

        state.importCSVTableRecords = [
          ...(action.payload?.duplicates
            ? (action.payload.duplicates.map((duplicate, idx) => ({
                message: 'A file with this data already exists',
                type: 'Duplicate',
                idx: idx,
                firstName: duplicate.new.firstName,
                lastName: duplicate.new.lastName,
                gender: duplicate.new.gender,
                status: 'Duplicate',
              })) as IImportUsersCSVTableData[])
            : []),
          ...(action.payload?.errors
            ? (action.payload.errors.map((error) => ({
                idx: -1,
                firstName: error.row.first_name,
                lastName: error.row.last_name,
                gender: error.row.gender,
                message: error.error,
                status: 'Error',
              })) as IImportUsersCSVTableData[])
            : []),
        ]
      }),
})
