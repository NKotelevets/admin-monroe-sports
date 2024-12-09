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
  IGetLeagueTeamsResponse, ILeagueTeamUpdateBody
} from '@/common/interfaces/leagueTeams'
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
        params
      }),
      transformResponse: (response: IPaginationResponse<IBELeagueTeam[]>) => ({
        count: response?.count || 0,
        results: transformKeysToCamelCase(response.results)
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
        url: `teams/teams/${id}/details`
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (response: IBELeagueTeamDetails) => ({
        name: response.name,
        coaches: response.coaches.map((coach) => ({
          id: coach.id,
          email: coach.email,
          fullName: coach.first_name + ' ' + coach.last_name,
          phone: coach.phone_number
        })),
        players: response.players.map((player) => ({
          id: player.id,
          email: player.email,
          fullName: player.first_name + ' ' + player.last_name,
          phone: player.phone_number
        })),
        teamsAdmins: response.team_admins.map((teamAdmin) => ({
          id: teamAdmin.id,
          email: teamAdmin.email,
          fullName: teamAdmin.first_name + ' ' + teamAdmin.last_name,
          phone: teamAdmin.phone_number
        })),
        headCoach: {
          id: response.head_coach.id,
          email: response.head_coach.email,
          fullName: response.head_coach.first_name + ' ' + response.head_coach.last_name,
          phone: response.head_coach.phone_number
        },
        leagues: (
          transformKeysToCamelCase<IFELeagueTeamDetails['leagues'], IBELeagueTeamDetails['leagues']>(response.leagues)
        ),
        divisions: (
          transformKeysToCamelCase<IFELeagueTeamDetails['divisions'], IBELeagueTeamDetails['divisions']>(response.divisions)
        ),
        subdivisions: (
          transformKeysToCamelCase<IFELeagueTeamDetails['subdivisions'], IBELeagueTeamDetails['subdivisions']>(response.subdivisions)
        )
      })
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
        url: `teams/teams/${id}/delete-as-admin`,
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
  useLeagueTeamsDeleteAllMutation
} = leagueTeamsApi

