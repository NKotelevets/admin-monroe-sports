import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithReAuth from '@/redux/reauthBaseQuery.ts'
import { TListLocationRequest, TListLocationResponse } from '@/common/types/events'
import { transformKeysToCamelCase } from '@/utils'
import { ILocation } from '@/common/interfaces/event.ts'

const LOCATIONS_TAG = 'LOCATIONS'

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [LOCATIONS_TAG],
  endpoints: (builder) => ({
    listLocation: builder.query<TListLocationResponse, TListLocationRequest>({
      query: (params) => ({
        url: `games/locations`,
        params
      }),
      transformResponse: (response: TListLocationResponse) => transformKeysToCamelCase(response),
      providesTags: [LOCATIONS_TAG]
    }),
    getLocation: builder.query<ILocation, { id: string }>({
      query: ({ id }) => ({
        url: `games/locations/${id}`
      }),
      transformResponse: (response: ILocation) => transformKeysToCamelCase(response),
      providesTags: [LOCATIONS_TAG]
    })
  })
})

export const {
  useLazyListLocationQuery,
  useLazyGetLocationQuery
} = locationsApi
