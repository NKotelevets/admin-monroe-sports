import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { leaguesApi } from '@/redux/leagues/leagues.api'

import { getNormalizedNewVersionOfLeagueTourn } from '@/utils/league'

import { IFELeague, ILeagueDeletionItemError, ILeagueDuplicate } from '@/common/interfaces/league'
import { TErrorDuplicate } from '@/common/types'

interface ILeagueImportInfoTableRecord {
  name: string
  message: string
  type: TErrorDuplicate
  idx: number
}

interface ILeaguesSliceState {
  leagues: IFELeague[]
  limit: number
  offset: number
  total: number
  order_by: 'asc' | 'desc' | null
  deletedRecordsErrors: ILeagueDeletionItemError[]
  createdRecordsNames: string[]
  duplicates: ILeagueDuplicate[]
  tableRecords: ILeagueImportInfoTableRecord[]
}

const leaguesSliceState: ILeaguesSliceState = {
  leagues: [],
  limit: 10,
  offset: 0,
  total: 0,
  order_by: null,
  deletedRecordsErrors: [],
  createdRecordsNames: [],
  duplicates: [],
  tableRecords: [],
}

export const leaguesSlice = createSlice({
  name: 'leaguesSlice',
  initialState: leaguesSliceState,
  reducers: {
    setPaginationParams: (
      state,
      action: PayloadAction<{
        limit: number
        offset: number
        order_by: string | null
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.order_by = action.payload.order_by as 'asc' | 'desc'
    },
    removeDuplicate: (state, action: PayloadAction<number>) => {
      const remainingDuplicates = state.duplicates.filter((duplicate) => duplicate.index !== action.payload)
      const remainingTableRecords = state.tableRecords.filter((tableRecord) => tableRecord.idx !== action.payload)
      const updatedDuplicates = remainingDuplicates.map((tR, idx) => ({ ...tR, index: idx }))
      const updatedTableRecords = remainingTableRecords.map((tR, idx) => ({ ...tR, idx }))

      state.duplicates = updatedDuplicates
      state.tableRecords = updatedTableRecords
    },
    removeCreatedRecordsNames: (state) => {
      state.createdRecordsNames = []
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(leaguesApi.endpoints.getLeagues.matchFulfilled, (state, action) => {
        state.leagues = action.payload.leagues
        state.total = action.payload.count
      })
      .addMatcher(leaguesApi.endpoints.importLeaguesCSV.matchFulfilled, (state, action) => {
        state.createdRecordsNames = action.payload?.success.map((item) => item.name)
        state.duplicates = action.payload?.duplicates
          ? action.payload.duplicates.map((duplicate, idx) => ({
              existing: duplicate.existing,
              new: getNormalizedNewVersionOfLeagueTourn(duplicate.existing.id, duplicate.new),
              index: idx,
            }))
          : []
        state.tableRecords = [
          ...(action.payload?.duplicates
            ? (action.payload.duplicates.map((duplicate, idx) => {
                return {
                  message: 'A file with this data already exists',
                  name: duplicate.existing.name,
                  type: 'Duplicate',
                  idx: idx,
                }
              }) as ILeagueImportInfoTableRecord[])
            : []),
          ...(action.payload?.errors
            ? (action.payload.errors.map((error) => ({
                idx: -1,
                message: error.error,
                name: error.league_name,
                type: 'Error',
              })) as ILeagueImportInfoTableRecord[])
            : []),
        ]
      })
      .addMatcher(
        isAnyOf(
          leaguesApi.endpoints.deleteAllLeagues.matchFulfilled,
          leaguesApi.endpoints.bulkDeleteLeagues.matchFulfilled,
        ),
        (state, action) => {
          state.deletedRecordsErrors = action.payload.items
        },
      ),
})
