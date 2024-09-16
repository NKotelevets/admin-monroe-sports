import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { TImportDeleteStatus } from '@/common/types'

interface IImportEventsCSVResponse {
  status: TImportDeleteStatus
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

