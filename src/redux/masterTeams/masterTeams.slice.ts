import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { masterTeamsApi } from '@/redux/masterTeams/masterTeams.api'

import { IFEMasterTeam, IMasterTeamError } from '@/common/interfaces/masterTeams'

interface IMasterTeamsSliceState {
  masterTeams: IFEMasterTeam[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdRecordsNames: string[]
  deletedRecordsErrors: IMasterTeamError[]
  tableRecords: []
  duplicates: []
}

const masterTeamsSliceState: IMasterTeamsSliceState = {
  masterTeams: [],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdRecordsNames: [],
  duplicates: [],
}

export const masterTeamsSlice = createSlice({
  name: 'masterTeamsSlice',
  initialState: masterTeamsSliceState,
  reducers: {
    setPaginationParams: (
      state,
      action: PayloadAction<{
        limit: number
        offset: number
        ordering: string | null
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering
    },
    removeCreatedRecordsNames: (state) => {
      state.createdRecordsNames = []
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(masterTeamsApi.endpoints.getMasterTeams.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.masterTeams = action.payload.results
      })
      .addMatcher(masterTeamsApi.endpoints.bulkDeleteMasterTeams.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      }),
})

