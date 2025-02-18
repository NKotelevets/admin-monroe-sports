import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { eventsApi } from '@/redux/events/events.api.ts'

import { IDeletingError } from '@/common/interfaces'
import { IEvent } from '@/common/interfaces/event.ts'
import { TBulkEditResponse, TBulkEditResponseRaw, TEventImportErrors, TEventWithStatus } from '@/common/types/events.ts'

type TInitialState = {
  events: IEvent[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdIds: string[]
  deletedRecordsErrors: IDeletingError[]
  tableRecords: []
  duplicates: []
  selectedRecordIds: string[]
  importCSVTableRecords: TEventImportErrors[]
  bulkEditRecords: IEvent[]
  bulkEditResults: TEventWithStatus[]
}

const initialEventsState: TInitialState = {
  events: [],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdIds: [],
  duplicates: [],
  selectedRecordIds: [],
  importCSVTableRecords: [],
  bulkEditRecords: [],
  bulkEditResults: [],
}

export const eventsSlice = createSlice({
  name: 'eventsSlice',
  initialState: initialEventsState,
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
    setSelectedRecordIds: (state, action: PayloadAction<string[]>) => {
      state.selectedRecordIds = action.payload
    },
    setBulkEditRecords: (state, action: PayloadAction<IEvent[]>) => {
      state.bulkEditRecords = action.payload
    },
    resetCreatedIds: (state) => {
      state.createdIds = []
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(eventsApi.endpoints.listEvents.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.events = action.payload.results
      })
      .addMatcher(eventsApi.endpoints.importEventsCSV.matchFulfilled, (state, action) => {
        state.createdIds = action.payload.success.map((event) => event.id)
        state.importCSVTableRecords = []
        state.importCSVTableRecords = action.payload?.errors
      })
      .addMatcher(eventsApi.endpoints.bulkDeleteEvents.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      })
      .addMatcher(eventsApi.endpoints.bulkEditEvents.matchFulfilled, (state, action) => {
        // state.deletedRecordsErrors = action.payload.items
        if (action.payload.status === 'yellow' || action.payload.status === 'red') {
          state.bulkEditResults = []
          if (action.payload.failed.length > 0) {
            const mergedFailures = transformErrors(action.payload.failed)
            const mappedErrors = mergedFailures.flatMap((fail) => {
              const match = state.bulkEditRecords.find((record) => record.id === fail.id)
              return match
                ? [
                    {
                      ...match,
                      locationId: match.location?.id,
                      status: fail.type,
                      errors: fail.errors,
                    } as TEventWithStatus,
                  ]
                : []
            })
            state.bulkEditResults = [...state.bulkEditResults, ...(mappedErrors || [])]
          }

          if (action.payload.success_rows.length > 0) {
            const mappedSuccess = action.payload.success_rows.flatMap((success) => {
              const match = state.bulkEditRecords.find((record) => record.id === success.id)
              return match
                ? [
                    {
                      ...match,
                      locationId: match.location?.id,
                      status: 'success',
                      error: undefined,
                    } as TEventWithStatus,
                  ]
                : []
            })
            state.bulkEditResults = [...state.bulkEditResults, ...(mappedSuccess || [])]
          }
        }
      }),
})


function transformErrors(data: TBulkEditResponseRaw['failed']): TBulkEditResponse['failed'] {
  const errorMap = new Map<string, { errors: string[]; type: string }>()

  data.forEach(({ id, error, type }) => {
    if (!errorMap.has(id)) {
      errorMap.set(id, { errors: [error as string], type })
    } else {
      errorMap.get(id)?.errors.push(error as string)
    }
  })

  return Array.from(errorMap, ([id, { errors, type }]) => ({ id, errors, type }))
}
