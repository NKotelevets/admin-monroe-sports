import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBEMasterTeam,
  ICreateMTRequest,
  IGetMasterTeamsRequest,
  IGetMasterTeamsResponse,
} from '@/common/interfaces/masterTeams'

const MASTER_TEAMS_TAG = 'MASTER_TEAMS'

export const masterTeamsApi = createApi({
  reducerPath: 'masterTeamsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [MASTER_TEAMS_TAG],
  endpoints: (builder) => ({
    getMasterTeams: builder.query<IGetMasterTeamsResponse, IGetMasterTeamsRequest>({
      query: (params) => ({
        url: 'teams/teams/all',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IBEMasterTeam[]>) => ({
        count: response?.count || 0,
        results: response.results.map((result) => ({
          id: result.id,
          name: result.name,
          headCoach: result.head_coach
            ? {
                id: result.head_coach.id,
                fullName: result.head_coach.first_name + ' ' + result.head_coach.last_name,
                email: result.head_coach.email,
              }
            : null,
          teamAdmin: result.team_admin
            ? {
                id: result.team_admin.id,
                fullName: result.team_admin.first_name + ' ' + result.team_admin.last_name,
                email: result.team_admin.email,
              }
            : null,
        })),
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

    // getMasterTeam: builder.query<{}, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `teams/teams/${id}/details`,
    //   }),
    //   providesTags: [MASTER_TEAMS_TAG],
    //   keepUnusedDataFor: 0.0001,
    // }),

    createMasterTeam: builder.mutation<void, ICreateMTRequest>({
      query: (body) => ({
        url: 'teams/teams/create-team-as-admin',
        method: 'POST',
        body,
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
  useCreateMasterTeamMutation,
} = masterTeamsApi

