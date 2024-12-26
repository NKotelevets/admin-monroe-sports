import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { leagueTeamsApi } from '@/redux/leagueTeams/leagueTeams.api'

import { IFELeagueTeam, ILeagueTeamImportTable } from '@/common/interfaces/leagueTeams'
import { IDeletingError } from '@/common/interfaces'
import {  } from '@/common/interfaces/leagueTeams'
import { duplicatesMap, duplicatesErrorMap, duplicatesTableMap } from '@/redux/leagueTeams/mappers'
import { TLeagueTeamDuplicate } from '@/common/types/leagueTeams.ts'

interface ILeagueTeamsSliceState {
  leagueTeams: IFELeagueTeam[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdIds: string[]
  deletedRecordsErrors: IDeletingError[]
  tableRecords: []
  importCSVTableRecords: ILeagueTeamImportTable[]
  duplicates: TLeagueTeamDuplicate[]
}

const leagueTeamsSliceState: ILeagueTeamsSliceState = {
  leagueTeams: [],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  importCSVTableRecords: [],
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
    removeDuplicate: (state, action: PayloadAction<number>) => {
      const remainingDuplicates = state.duplicates.filter((duplicate) => duplicate.idx !== action.payload)
      const remainingTableRecords = state.importCSVTableRecords.filter(
        (tableRecord) => tableRecord.idx !== action.payload
      )
      const updatedDuplicates = remainingDuplicates.map((tR, idx) => ({ ...tR, idx: idx }))
      const updatedTableRecords = remainingTableRecords.map((tR, idx) => ({ ...tR, idx }))

      state.duplicates = updatedDuplicates
      state.importCSVTableRecords = updatedTableRecords
    }
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(leagueTeamsApi.endpoints.getLeagueTeams.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.leagueTeams = action.payload.results
      })
      .addMatcher(leagueTeamsApi.endpoints.bulkDeleteLeagueTeams.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      })
  .addMatcher(leagueTeamsApi.endpoints.leagueTeamsImportCSV.matchFulfilled, (state, action) => {
    state.createdIds = action.payload.success
    state.duplicates = action.payload?.duplicates ? action.payload.duplicates.map(duplicatesMap) : []
    state.importCSVTableRecords = [
      ...(action.payload?.duplicates ? action.payload.duplicates.map(duplicatesTableMap) : []),
      ...(action.payload?.errors ? action.payload.errors.map(duplicatesErrorMap) : [])
    ]
  }),
})

