import { ILocation } from '@/common/interfaces/event'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { locationsApi } from '@/redux/locations/locations.api.ts'
import { TPagination } from '@/common/types'
import { TListLocationResponse } from '@/common/types/events.ts'

interface LocationsState {
  locations: ILocation[]
}

const initialState: LocationsState & TPagination = {
  locations: [],
  total: 0,
  limit: 10,
  offset: 0,
  ordering: undefined
}

export const locationsSlice = createSlice({
  name: 'locationsSlice',
  initialState,
  reducers: {
    setPaginationParams: (
      state,
      action: PayloadAction<Omit<TListLocationResponse, 'results' | 'total'>>
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering
    }
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(locationsApi.endpoints.listLocation.matchFulfilled, (state, action) => {
        state.total = action.payload.count || 0
        state.locations = action.payload.results
      })
      .addMatcher(locationsApi.endpoints.getLocation.matchFulfilled, (state, action) => {
        state.total += 1
        state.locations = [
          ...new Map([...state.locations, action.payload].map((loc) => [loc.id, loc])).values()
        ]
      })
})
