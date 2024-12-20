import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { TDeleteStatus } from '@/common/types'
import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'
import { TListEventRequestParams, TPaginatedEvents } from '@/common/types/games.ts'
import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { IEvent } from '@/common/interfaces/event.ts'

const EVENTS_TAG = 'EVENTS'

interface IImportEventsCSVResponse {
  status: TDeleteStatus
}

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [EVENTS_TAG],
  endpoints: (builder) => ({
    /**
     * List all events with pagination.
     */
    listEvents: builder.query<IPaginationResponse<IEvent[]>, TListEventRequestParams>({
      query: (params) => ({
        url: 'games/admin-events',
        params: transformKeysToSnakeCase(params)
      }),
      transformResponse: (response: TPaginatedEvents) => ({ ...transformKeysToCamelCase(response) }),
      providesTags: [EVENTS_TAG]
    }),
    /**
     * Delete multiple events at once
     */
    bulkDelete: builder.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: 'games/admin-events',
        body: {
          ids
        }
      }),
    }),
    /**
     * Import event playoffs
     */
    importEventsCSV: builder.mutation<IImportEventsCSVResponse, FormData>({
      query: (body) => ({
        url: 'games/rsvp/import-playoffs-from-csv',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLazyListEventsQuery,
  useImportEventsCSVMutation
} = eventsApi

