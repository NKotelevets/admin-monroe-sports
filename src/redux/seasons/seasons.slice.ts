import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { seasonsApi } from '@/redux/seasons/seasons.api'

import { getNormalizedVersionOfSeason } from '@/utils/season'

import { SINGLE_ELIMINATION_BRACKET } from '@/common/constants/league'
import {
  IDeletionSeasonItemError,
  IFESeason,
  IImportSeasonTableRecord,
  ISeasonDuplicate,
} from '@/common/interfaces/season'
import { TErrorDuplicate } from '@/common/types'

type TBracketMode = 'create' | 'edit'

interface ISeasonsSliceState {
  seasons: IFESeason[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdRecordsNames: { name: string; showIcon: boolean }[]
  deletedRecordsErrors: IDeletionSeasonItemError[]
  tableRecords: IImportSeasonTableRecord[]
  duplicates: ISeasonDuplicate[]
  orderBy: string | null
  isCreateBracketPage: boolean
  pathToSubdivisionDataAndIndexes: string
  selectedLeague: { id: string; name: string } | null
  bracketIdx: number
  bracketMode: TBracketMode
  isShowImportWarningModal: boolean
  isDuplicateNames: boolean
  selectedBracketId: number | null
}

const seasonsSliceState: ISeasonsSliceState = {
  seasons: [],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdRecordsNames: [],
  duplicates: [],
  orderBy: null,
  isCreateBracketPage: false,
  pathToSubdivisionDataAndIndexes: '',
  selectedLeague: null,
  bracketIdx: 0,
  bracketMode: 'create',
  isShowImportWarningModal: false,
  isDuplicateNames: false,
  selectedBracketId: null,
}

export const seasonsSlice = createSlice({
  name: 'seasonsSlice',
  initialState: seasonsSliceState,
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
    removeDuplicate: (state, action: PayloadAction<number>) => {
      const remainingDuplicates = state.duplicates.filter((duplicate) => duplicate.index !== action.payload)
      const remainingTableRecords = state.tableRecords.filter((tableRecord) => tableRecord.idx !== action.payload)
      const updatedDuplicates = remainingDuplicates.map((tR, idx) => ({ ...tR, index: idx }))
      const updatedTableRecords = remainingTableRecords.map((tR, idx) => ({ ...tR, idx }))

      state.duplicates = updatedDuplicates
      state.tableRecords = updatedTableRecords
    },
    setBracketMode: (state, action: PayloadAction<TBracketMode>) => {
      state.bracketMode = action.payload
    },
    setIsCreateBracketPage: (state, action: PayloadAction<boolean>) => {
      state.isCreateBracketPage = action.payload
    },
    setPathToSubdivisionDataAndIndexes: (state, action: PayloadAction<string>) => {
      state.pathToSubdivisionDataAndIndexes = action.payload
    },
    setSelectedLeague: (state, action: PayloadAction<{ id: string; name: string } | null>) => {
      state.selectedLeague = action.payload
    },
    setBracketIdx: (state, action: PayloadAction<number>) => {
      state.bracketIdx = action.payload
    },
    hideImportWarningModal: (state) => {
      state.isShowImportWarningModal = false
    },
    setIsDuplicateNames: (state, action: PayloadAction<boolean>) => {
      state.isDuplicateNames = action.payload
    },
    setSelectedBracketId: (state, action: PayloadAction<number | null>) => {
      state.selectedBracketId = action.payload
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(seasonsApi.endpoints.getSeasons.matchFulfilled, (state, action) => {
        state.seasons = action.payload.seasons
        state.total = action.payload.count
      })
      .addMatcher(
        isAnyOf(
          seasonsApi.endpoints.deleteAllSeasons.matchFulfilled,
          seasonsApi.endpoints.bulkSeasonsDelete.matchFulfilled,
        ),
        (state, action) => {
          state.deletedRecordsErrors = action.payload.items
        },
      )
      .addMatcher(seasonsApi.endpoints.importSeasonsCSV.matchFulfilled, (state, action) => {
        const success = action.payload.success || []
        const duplicates = action.payload.duplicates || []
        const errors = action.payload.errors || []

        state.createdRecordsNames = success.map((item) => ({
          name: item.name,
          showIcon: false,
        }))

        const isChanged =
          success.flatMap((r) => r.divisions.flatMap((d) => d.sub_division).filter((subDiv) => !!subDiv.changed))
            .length > 0

        if (action.payload.status === 'green') {
          state.isShowImportWarningModal = !!isChanged
        }

        if (action.payload.status !== 'green') {
          const convertedDuplicates: ISeasonDuplicate[] = duplicates.map((duplicate, idx) => ({
            existing: duplicate.existing,
            new: getNormalizedVersionOfSeason(duplicate.existing, duplicate.new),
            index: idx,
          }))

          const isSingleEliminationBracketInNewRecords = !!duplicates?.find((duplicate) => {
            const division = duplicate.existing.divisions?.find((d) => d.name === duplicate.new['Division/Pool Name'])
            const isSEB = duplicate.new['Playoff Format'] === SINGLE_ELIMINATION_BRACKET

            if (!division) return isSEB

            const existingSubdivision = division.sub_division?.find(
              (subdiv) => subdiv.name === duplicate.new['Subdiv/Pool Name'],
            )

            if (!existingSubdivision) return isSEB

            return existingSubdivision.playoff_format === 1 ? false : isSEB
          })

          state.isShowImportWarningModal = isSingleEliminationBracketInNewRecords || isChanged

          state.duplicates = convertedDuplicates

          state.tableRecords = [
            ...duplicates.map((duplicate, idx) => ({
              message: 'A record with this data already exists',
              name: duplicate.existing.name,
              type: 'Duplicate' as TErrorDuplicate,
              idx: idx,
              leagueId: duplicate.existing.league.id,
              leagueName: duplicate.existing.league.name,
              id: duplicate.existing.id,
            })),
            ...errors.map((error) => ({
              idx: -1,
              message: error.error,
              name: error.season_name || '-',
              type: 'Error' as TErrorDuplicate,
              leagueId: (error.league && error.league.name) || '-',
              leagueName: (error.league && error.league.name) || '-',
              id: '',
            })),
          ]
        }
      }),
})
