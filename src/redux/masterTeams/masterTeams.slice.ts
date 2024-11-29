import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { masterTeamsApi } from '@/redux/masterTeams/masterTeams.api'

import {
  IFEDuplicate,
  IFEMasterTeam,
  IImportMasterTeamCSVTableData,
  IMasterTeamError
} from '@/common/interfaces/masterTeams'
import { duplicatesErrorMap, duplicatesMap, duplicatesTableMap } from '@/redux/masterTeams/mappers'

interface IMasterTeamsSliceState {
  masterTeams: IFEMasterTeam[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdRecordsNames: string[]
  deletedRecordsErrors: IMasterTeamError[]
  tableRecords: []
  importCSVTableRecords: IImportMasterTeamCSVTableData[]
  duplicates: IFEDuplicate[]
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
  importCSVTableRecords: [],
  duplicates: []
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
      }>
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering
    },
    removeCreatedRecordsNames: (state) => {
      state.createdRecordsNames = []
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
      .addMatcher(masterTeamsApi.endpoints.getMasterTeams.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.masterTeams = action.payload.results
      })
      .addMatcher(masterTeamsApi.endpoints.bulkDeleteMasterTeams.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      })
      .addMatcher(masterTeamsApi.endpoints.masterTeamsImportCSV.matchFulfilled, (state, action) => {
        state.createdRecordsNames = action.payload.success
        state.duplicates = action.payload?.duplicates ? action.payload.duplicates.map(duplicatesMap) : []
        state.importCSVTableRecords = [
          ...(action.payload?.duplicates ? action.payload.duplicates.map(duplicatesTableMap) : []),
          ...(action.payload?.errors ? action.payload.errors.map(duplicatesErrorMap) : [])
        ]
      })
})
