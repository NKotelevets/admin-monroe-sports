import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBELeagueTeam,
  IBELeagueTeamDetails, IBulkDeleteResponse, ICreateLeagueTeamRequest,
  IFELeagueTeamDetails,
  IGetLeagueTeamsRequest,
  IGetLeagueTeamsResponse,
} from '@/common/interfaces/leagueTeams'
import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'
import { IGetScheduleRequestParams, IScheduleRequest, IScheduleRequestResponse } from '@/common/interfaces'

const LEAGUE_TEAMS_TAG = 'LEAGUE_TEAMS'

export const leagueTeamsApi = createApi({
  reducerPath: 'leagueTeamsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [LEAGUE_TEAMS_TAG],
  endpoints: (builder) => ({
    getLeagueTeams: builder.query<IGetLeagueTeamsResponse, IGetLeagueTeamsRequest>({
      query: (params) => ({
        url: 'teams/league-teams',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IBELeagueTeam[]>) => ({
        count: response?.count || 0,
        results: transformKeysToCamelCase(response.results),
      }),
      providesTags: [LEAGUE_TEAMS_TAG],
    }),

    leagueTeamsBulkDelete: builder.mutation<void, { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/seasons/bulk-seasons-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    leagueTeamsDeleteAll: builder.mutation<void, void>({
      query: () => ({
        url: 'teams/seasons/delete_all',
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    leagueTeamsImportCSV: builder.mutation<void, FormData>({
      query: (body) => ({
        url: 'teams/seasons/import-seasons',
        body,
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    getLeagueTeam: builder.query<IFELeagueTeamDetails, { id: string }>({
      query: ({ id }) => ({
        url: `teams/league-teams/${id}`,
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (response: IBELeagueTeamDetails) => ({
        ...transformKeysToCamelCase(response),
        masterTeamAdmin: response.master_team_admin ? transformKeysToCamelCase({
          ...response.master_team_admin,
          full_name: `${response.master_team_admin.first_name} ${response.master_team_admin.last_name}`,
          phone: response.master_team_admin.phone_number
        }) : undefined,
        masterTeamAdmins: response.master_team_admins?.map(mta => transformKeysToCamelCase({
          ...mta,
          full_name: `${mta.first_name} ${mta.last_name}`,
          phone: mta.phone_number
        })),
        headCoach: response.head_coach ? transformKeysToCamelCase({
          ...response.head_coach,
          full_name: `${response.head_coach.first_name} ${response.head_coach.last_name}`,
          phone: response.head_coach.phone_number
        }) : undefined,
      }),
    }),

    createLeagueTeam: builder.mutation<void, ICreateLeagueTeamRequest>({
      query: (body) => ({
        url: 'teams/league-teams/create-league-team-as-admin',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    editLeagueTeam: builder.mutation<
      void,
      {
        id: string
        body: ICreateLeagueTeamRequest
      }
    >({
      query: ({ body, id }) => ({
        url: `teams/teams/${id}/update-team-as-admin`,
        method: 'PUT',
        body,
      }),
    }),

    deleteLeagueTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `teams/teams/${id}/delete-as-admin`,
        method: 'DELETE',
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    bulkDeleteLeagueTeams: builder.mutation<IBulkDeleteResponse, string[]>({
      query: (ids) => ({
        url: 'teams/league-teams/bulk-teams-delete',
        body: {
          ids,
        },
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
    }),

    getLeagueTeamScheduleRequest: builder.query<IScheduleRequest[], IGetScheduleRequestParams>({
      query: (params) => ({
        url: 'availability/get-league-team-availability',
        params,
      }),
      transformResponse: (response: IScheduleRequestResponse) => (
        transformKeysToCamelCase(response)
      )
    }),
  }),
})

export const {
  useGetLeagueTeamsQuery,
  useLazyGetLeagueTeamsQuery,
  useGetLeagueTeamQuery,
  useCreateLeagueTeamMutation,
  useEditLeagueTeamMutation,
  useDeleteLeagueTeamMutation,
  useLeagueTeamsImportCSVMutation,
  useLeagueTeamsBulkDeleteMutation,
  useBulkDeleteLeagueTeamsMutation,
  useLeagueTeamsDeleteAllMutation,
  useLazyGetLeagueTeamScheduleRequestQuery
} = leagueTeamsApi

