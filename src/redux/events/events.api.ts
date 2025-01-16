import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { TBulkDeleteResponse, TDeleteStatus } from '@/common/types'
import { removeEmptyStringAttributes, transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'
import {
  TEventCreationPayload,
  TEventEditingPayload,
  TListEventRequestParams,
  TPaginatedEvents
} from '@/common/types/events.ts'
import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { eventType } from '@/common/constants/events.ts'

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
     * Get an event by ID.
     */
    getEvent: builder.query<IEvent, { id: string }>({
      query: ({ id }) => ({
        url: `games/admin-events/${id}`
      }),
      transformResponse: (response: IEvent) => ({ ...transformKeysToCamelCase(response) })
    }),
    /**
     * Create a new event
     */
    createEvent: builder.mutation<void, TEventCreationPayload>({
      query: (body) => {
        let url = 'games/admin-events/create-practice-event'

        body = removeEmptyStringAttributes(body)

        switch (body.event_type) {
          case eventType.PRACTICE:
            url = 'games/admin-events/create-practice-event'
            break
          case eventType.OTHER:
            url = 'games/admin-events/create-other-event'
            body = {
              ...body,
              master_team_1_id: body.team_1_id,
              master_team_2_id: body.team_2_id
            } as TEventCreationPayload
            break
          case eventType.GAME:
            url = 'games/admin-events/create-game-event'
            body = {
              ...body,
              league_team_1_id: body.team_1_id,
              league_team_2_id: body.team_2_id
            } as TEventCreationPayload
            break
          case eventType.PLAYOFF:
            // playoffs are not created via admin panel
            // only through import csv
            break
        }

        return ({
          url,
          method: 'POST',
          body
        })
      },
      invalidatesTags: [EVENTS_TAG]
    }),
    /**
     * Edit an event
     */
    editEvent: builder.mutation<void, TEventEditingPayload>({
      query: (body) => {
        body = removeEmptyStringAttributes(body)

        switch (body.event_type) {
          case eventType.GAME || eventType.PLAYOFF:
            body = {
              ...body,
              league_team_1_id: body.team_1_id,
              league_team_2_id: body.team_2_id
            } as TEventEditingPayload
            break
        }

        return ({
          url: `games/admin-events/${body.id}`,
          method: 'PATCH',
          body
        })
      },
      invalidatesTags: [EVENTS_TAG]
    }),
    /**
     * Delete multiple events at once
     */
    bulkDeleteEvents: builder.mutation<TBulkDeleteResponse, string[]>({
      query: (ids) => ({
        url: 'games/admin-events/bulk-events-delete',
        body: {
          ids
        },
        method: 'POST'
      }),
      invalidatesTags: [EVENTS_TAG]
    }),
    /**
     * Import event playoffs
     */
    importEventsCSV: builder.mutation<IImportEventsCSVResponse, FormData>({
      query: (body) => ({
        url: 'games/admin-events/import-events-from-csv',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useGetEventQuery,
  useLazyListEventsQuery,
  useImportEventsCSVMutation,
  useCreateEventMutation,
  useEditEventMutation,
  useBulkDeleteEventsMutation
} = eventsApi

