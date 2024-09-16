import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'

const MASTER_TEAMS_TAG = 'MASTER_TEAMS'

export const masterTeamsApi = createApi({
  reducerPath: 'masterTeamsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [MASTER_TEAMS_TAG],
  endpoints: (builder) => ({
    getMasterTeams: builder.query<
      IPaginationResponse<[]>,
      {
        limit: number
        offset: number
        ordering?: string | null
      }
    >({
      query: (params) => ({
        url: 'teams/seasons/',
        params,
      }),
      providesTags: [MASTER_TEAMS_TAG],
    }),
    masterTeamsDeleteRecord: builder.mutation<void, string>({
      query: (masterTeamId) => ({
        url: `${masterTeamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [MASTER_TEAMS_TAG],
    }),
    masterTeamsBulkDelete: builder.mutation<void, { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/seasons/bulk-seasons-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
      invalidatesTags: [MASTER_TEAMS_TAG],
    }),
    masterTeamsDeleteAll: builder.mutation<void, void>({
      query: () => ({
        url: 'teams/seasons/delete_all',
        method: 'POST',
      }),
      invalidatesTags: [MASTER_TEAMS_TAG],
    }),
    masterTeamsImportCSV: builder.mutation<void, FormData>({
      query: (body) => ({
        url: 'teams/seasons/import-seasons',
        body,
        method: 'POST',
      }),
      invalidatesTags: [MASTER_TEAMS_TAG],
    }),
  }),
})

export const {
  useMasterTeamsDeleteRecordMutation,
  useMasterTeamsBulkDeleteMutation,
  useMasterTeamsDeleteAllMutation,
  useMasterTeamsImportCSVMutation,
  useGetMasterTeamsQuery,
  useLazyGetMasterTeamsQuery,
} = masterTeamsApi

