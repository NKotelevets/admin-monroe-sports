import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { TDeleteStatus } from '@/common/types'

interface IImportEventsCSVResponse {
  status: TDeleteStatus
}

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    importEventsCSV: builder.mutation<IImportEventsCSVResponse, FormData>({
      query: (body) => ({
        url: 'games/rsvp/import-playoffs-from-csv',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useImportEventsCSVMutation } = gamesApi

