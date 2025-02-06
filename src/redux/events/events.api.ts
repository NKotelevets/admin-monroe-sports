import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { removeEmptyStringAttributes, transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'

import { eventType } from '@/common/constants/events.ts'
import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { TBulkDeleteResponse } from '@/common/types'
import {
  TBulkEditResponseRaw,
  TEventBulkEditPayload,
  TEventCreationPayload,
  TEventEditingPayload,
  TEventImportResponse,
  TEventImportTable,
  TListEventRequestParams,
  TPaginatedEvents
} from '@/common/types/events.ts'

const EVENTS_TAG = 'EVENTS'

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
        url: `games/admin-events?${stringify(transformKeysToSnakeCase(params), { arrayFormat: 'repeat' })}`,
      }),
      transformResponse: (response: TPaginatedEvents) => ({ ...transformKeysToCamelCase(response) }),
      providesTags: [EVENTS_TAG],
    }),
    /**
     * Get an event by ID.
     */
    getEvent: builder.query<IEvent, { id: string }>({
      query: ({ id }) => ({
        url: `games/admin-events/${id}`,
      }),
      transformResponse: (response: IEvent) => ({ ...transformKeysToCamelCase(response) }),
    }),
    /**
     * Create a new event
     */
    createEvent: builder.mutation<void, TEventCreationPayload>({
      query: (body) => {
        let url = 'games/admin-events/create-practice-event'

        body = removeEmptyStringAttributes(body)
        body = transformKeysToSnakeCase(body)

        switch (body.event_type) {
          case eventType.PRACTICE:
            url = 'games/admin-events/create-practice-event'
            break
          case eventType.OTHER:
            url = 'games/admin-events/create-other-event'
            body = {
              ...body,
              master_team_1_id: body.team_1_id,
              master_team_2_id: body.team_2_id,
            } as TEventCreationPayload
            break
          case eventType.GAME:
            url = 'games/admin-events/create-game-event'
            body = {
              ...body,
              league_team_1_id: body.team_1_id,
              league_team_2_id: body.team_2_id,
            } as TEventCreationPayload
            break
          case eventType.PLAYOFF:
            // playoffs are not created via admin panel
            // only through import csv
            break
        }

        return {
          url,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: [EVENTS_TAG],
    }),
    /**
     * Edit an event
     */
    editEvent: builder.mutation<void, TEventEditingPayload>({
      query: (body) => {
        body = removeEmptyStringAttributes(body)
        body = transformKeysToSnakeCase(body)

        switch (body.event_type) {
          case eventType.GAME || eventType.PLAYOFF:
            body = {
              ...body,
              league_team_1_id: body.team_1_id,
              league_team_2_id: body.team_2_id,
            } as TEventEditingPayload
            break
        }

        return {
          url: `games/admin-events/${body.id}/update-event`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: [EVENTS_TAG],
    }),
    /**
     * Bulk Edit events
     */
    bulkEditEvents: builder.mutation<TBulkEditResponseRaw, { events: TEventBulkEditPayload[], ignoreConflicts: boolean }>({
      query: ({ events: body, ignoreConflicts }) => {
        body = body.map((b) => removeEmptyStringAttributes(b))
        body = transformKeysToSnakeCase(body)

        return {
          url: `games/admin-events/bulk-events-edit`,
          method: 'POST',
          body: {
            events: body,
            ignore_conflicts: ignoreConflicts
          },
        }
      },
      invalidatesTags: [EVENTS_TAG],
    }),
    /**
     * Delete multiple events at once
     */
    bulkDeleteEvents: builder.mutation<TBulkDeleteResponse, string[]>({
      query: (ids) => ({
        url: 'games/admin-events/bulk-events-delete',
        body: {
          ids,
        },
        method: 'POST',
      }),
      invalidatesTags: [EVENTS_TAG],
    }),
    /**
     * Import event playoffs
     */
    importEventsCSV: builder.mutation<TEventImportTable, { file: FormData; importType: 'playoffs' | 'others' }>({
      query: ({ file, importType }) => ({
        url: `games/admin-events/${importType === 'others' ? 'import-events-from-csv' : 'import-playoff-events-from-csv'}`,
        method: 'POST',
        body: file,
      }),
      transformResponse: (response: TEventImportResponse) => {
        return {
          status: response.status,
          success: response.success,
          errors: response.errors.map((record) => ({
            status: record.status,
            error: record.error,
            index: record.index,
            date: record.row.Date,
            eventDescription: record.row['Event Description'],
            type: record.row['Event Type'],
            team1Name: record.row['Team 1 Name'],
            team1Season: record.row['Team 1 Season'],
            team1League: record.row['Team 1 League'],
            team2Name: record.row['Team 2 Name'],
            team2Season: record.row['Team 2 Season'],
            team2League: record.row['Team 2 League'],
            location: record.row.Location,
            courtOrField: record.row['Court/Field'],
            time: record.row['Start Time'],
            duration: record.row['Duration (in minutes)'],
            zipCode: record.row['Zip Code'],
            subResources: record.row['Sub Resource'],
          })),
        } as TEventImportTable
      },
    }),
  }),
})

export const {
  useGetEventQuery,
  useLazyListEventsQuery,
  useImportEventsCSVMutation,
  useCreateEventMutation,
  useEditEventMutation,
  useBulkDeleteEventsMutation,
  useBulkEditEventsMutation,
} = eventsApi
