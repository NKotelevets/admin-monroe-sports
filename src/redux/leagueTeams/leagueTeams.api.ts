import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBELeagueTeam,
  IBELeagueTeamDetails, ICreateLeagueTeamRequest,
  IFELeagueTeamDetails,
  IGetLeagueTeamsRequest,
  IGetLeagueTeamsResponse,
  ILeagueTeamError,
} from '@/common/interfaces/leagueTeams'
import { TDeleteStatus } from '@/common/types'
import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'

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
        results: response.results.map(lt => {
          const type = lt.master_team ? 'masterTeam' : 'teamAdmin'

          let adminData
          if (type === 'masterTeam') {
            adminData = lt.master_team?.team_admins?.map(admin => ({
              id: admin.id,
              name: `${admin.first_name} ${admin.last_name}`,
              email: admin?.email,
            }))
          } else {
            adminData = [{
              id: lt.master_team_admin.id,
              name: null,
              email: null
            }]
          }

          return {
            ...transformKeysToCamelCase(lt),
            type,
            adminData
          }
        }),
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
      transformResponse: (response: IBELeagueTeamDetails): IFELeagueTeamDetails => {
        const type = response.master_team ? 'masterTeam' : 'teamAdmin'

        let adminData
        if (type === 'masterTeam') {
          adminData = response.master_team?.team_admins?.map(admin => ({
            id: admin.id,
            name: `${admin.first_name} ${admin.last_name}`,
            email: admin?.email,
          }))
        } else {
          adminData = [{
            id: response.master_team_admin || '',
            name: null,
            email: null
          }]
        }
       return {
         ...transformKeysToCamelCase<IFELeagueTeamDetails, IBELeagueTeamDetails>(response),
         adminData,
         type
       }
      }
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
        url: `teams/league-teams/${id}/update-league-team-as-admin`,
        method: 'PATCH',
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

    bulkDeleteLeagueTeams: builder.mutation<
      {
        items: ILeagueTeamError[]
        status: TDeleteStatus
        total: number
        success: number
      },
      string[]
    >({
      query: (ids) => ({
        url: 'teams/teams/bulk-teams-delete',
        body: {
          ids,
        },
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
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
} = leagueTeamsApi

