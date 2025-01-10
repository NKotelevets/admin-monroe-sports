import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBEImportLeagueTeamCSVResponse,
  IBELeagueTeam,
  IBELeagueTeamDetails,
  IBulkDeleteResponse,
  ICreateLeagueTeamRequest,
  IFEImportLeagueTeamCSVResponse,
  IFELeagueTeamDetails,
  IGetLeagueTeamsRequest,
  IGetLeagueTeamsResponse,
  ILeagueTeamUpdateBody,
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
        params
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
              email: admin?.email
            }))
          } else {
            adminData = [{
              id: lt.master_team_admin.id,
              name: `${lt.master_team_admin.first_name} ${lt.master_team_admin.last_name}`,
              email: `${lt.master_team_admin.email}`
            }]
          }

          return {
            ...transformKeysToCamelCase(lt),
            type,
            adminData
          }
        })
      }),
      providesTags: [LEAGUE_TEAMS_TAG]
    }),

    leagueTeamsBulkDelete: builder.mutation<void, { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/seasons/bulk-seasons-delete',
        method: 'POST',
        body: {
          ids
        }
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG]
    }),

    leagueTeamsDeleteAll: builder.mutation<void, void>({
      query: () => ({
        url: 'teams/seasons/delete_all',
        method: 'POST'
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG]
    }),

    leagueTeamsImportCSV: builder.mutation<IFEImportLeagueTeamCSVResponse, FormData>({
      query: (body) => ({
        url: 'teams/league-teams/import-league-teams-from-csv',
        body,
        method: 'POST'
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG],
      transformResponse(response: IBEImportLeagueTeamCSVResponse) {
        return {
          ...response,
          errors: transformKeysToCamelCase(response?.errors),
          duplicates: response.duplicates?.map((dupe, idx) => ({
            idx,
            existing: transformKeysToCamelCase(dupe.existing),
            new: {
              divisionName: dupe.new['Division/Pool Name'],
              leagueName: dupe.new['League/Tourn Name'],
              leagueTeamName: dupe.new['League Team Name'],
              masterTeamName: dupe.new['Linked Master Team Name'],
              mtAdminEmail: dupe.new['MT Team Admin Email'],
              mtAdminName: dupe.new['MT Team Admin First and Last Name'],
              subdivisionName: dupe.new['Subdiv/Pool Name']
            }
          }))
        }
      }
    }),

    getLeagueTeam: builder.query<IFELeagueTeamDetails, { id: string }>({
      query: ({ id }) => ({
        url: `teams/league-teams/${id}`
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (response: IBELeagueTeamDetails) => {
        const type = response.master_team ? 'masterTeam' : 'teamAdmin'

        let adminData
        if (type === 'masterTeam') {
          adminData = response.master_team?.teamAdmins?.map(admin => ({
            id: admin.id,
            name: `${admin.firstName} ${admin.lastName}`.trim(),
            email: admin?.email
          }))
        } else {
          adminData = [{
            id: response.master_team_admin.id || '',
            name: null,
            email: null
          }]
        }

        return ({
          ...transformKeysToCamelCase(response),
          adminData,
          type,
          masterTeamAdmin: response.master_team_admin ? transformKeysToCamelCase({
            ...response.master_team_admin,
            full_name: `${response.master_team_admin.first_name} ${response.master_team_admin.last_name}`.trim(),
            phone: response.master_team_admin.phone_number
          }) : undefined,
          masterTeamAdmins: response.master_team_admins?.map(mta => transformKeysToCamelCase({
            ...mta,
            full_name: `${mta.first_name} ${mta.last_name}`.trim(),
            phone: mta.phone_number
          })),
          headCoach: response.head_coach ? transformKeysToCamelCase({
            ...response.head_coach,
            full_name: `${response.head_coach.first_name} ${response.head_coach.last_name}`.trim(),
            phone: response.head_coach.phone_number
          }) : undefined
        })
      }
    }),

    createLeagueTeam: builder.mutation<void, ICreateLeagueTeamRequest>({
      query: (body) => ({
        url: 'teams/league-teams/create-league-team-as-admin',
        method: 'POST',
        body: transformKeysToSnakeCase(body)
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG]
    }),

    editLeagueTeam: builder.mutation<void, ILeagueTeamUpdateBody>({
      query: ({ body, id }) => ({
        url: `teams/league-teams/${id}/update-league-team-as-admin`,
        method: 'PATCH',
        body
      })
    }),

    deleteLeagueTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `teams/league-teams/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG]
    }),

    bulkDeleteLeagueTeams: builder.mutation<IBulkDeleteResponse, string[]>({
      query: (ids) => ({
        url: 'teams/league-teams/bulk-teams-delete',
        body: {
          ids
        },
        method: 'POST'
      }),
      invalidatesTags: [LEAGUE_TEAMS_TAG]
    }),

    getLeagueTeamScheduleRequest: builder.query<IScheduleRequest[], IGetScheduleRequestParams>({
      query: (params) => ({
        url: 'availability/get-masterteam-availability',
        params
      }),
      transformResponse: (response: IScheduleRequestResponse) => (
        transformKeysToCamelCase(response)
      )
    })
  })
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

