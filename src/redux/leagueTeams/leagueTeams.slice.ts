import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { leagueTeamsApi } from '@/redux/leagueTeams/leagueTeams.api'

import { IFELeagueTeam, ILeagueTeamError } from '@/common/interfaces/leagueTeams'

interface ILeagueTeamsSliceState {
  leagueTeams: IFELeagueTeam[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdIds: string[]
  deletedRecordsErrors: ILeagueTeamError[]
  tableRecords: []
  duplicates: []
}

const leagueTeamsSliceState: ILeagueTeamsSliceState = {
  leagueTeams: [],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdIds: [],
  duplicates: [],
}

export const leagueTeamsSlice = createSlice({
  name: 'leagueTeamsSlice',
  initialState: leagueTeamsSliceState,
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
    resetCreatedIds: (state) => {
      state.createdIds = []
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(leagueTeamsApi.endpoints.getLeagueTeams.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.leagueTeams = action.payload.results
      })
      .addMatcher(leagueTeamsApi.endpoints.bulkDeleteLeagueTeams.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      }),
})

