import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDeletingError } from '@/common/interfaces'
import { IEvent } from '@/common/interfaces/event.ts'
import { eventsApi } from '@/redux/events/events.api.ts'
import { TEventImportErrors } from '@/common/types/events.ts'

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
  importCSVTableRecords: []
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
      }>
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering
    },
    setSelectedRecordIds: (state, action: PayloadAction<string[]>) => {
      state.selectedRecordIds = action.payload
    },
    resetCreatedIds: (state) => {
      state.createdIds = []
    }
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(eventsApi.endpoints.listEvents.matchFulfilled, (state, action) => {
        state.total = action.payload.count
        state.events = action.payload.results
      })
      .addMatcher(eventsApi.endpoints.importEventsCSV.matchFulfilled, (state, action) => {
        state.createdIds = action.payload.success.map(event => event.id)
        state.importCSVTableRecords = action.payload?.errors
      })
      .addMatcher(eventsApi.endpoints.bulkDeleteEvents.matchFulfilled, (state, action) => {
        state.deletedRecordsErrors = action.payload.items
      }),
})
