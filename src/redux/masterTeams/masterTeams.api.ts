import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBEMasterTeam,
  IBEMasterTeamDetails,
  ICreateMTRequest,
  IFEMasterTeamDetails,
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
          headCoachId: result.head_coach?.id || null,
          headCoachEmail: result.head_coach?.email || null,
          headCoachFullName: result.head_coach
            ? result.head_coach?.first_name + ' ' + result.head_coach?.last_name
            : null,
          teamAdminEmail: result.team_admins?.[0].email || '',
          teamAdminId: result.team_admins?.[0].id || '',
          teamAdminFullName: result.team_admins?.[0]
            ? result.team_admins[0].first_name + ' ' + result.team_admins[0].last_name
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

    getMasterTeam: builder.query<IFEMasterTeamDetails, { id: string }>({
      query: ({ id }) => ({
        url: `teams/teams/${id}/details`,
      }),
      providesTags: [MASTER_TEAMS_TAG],
      keepUnusedDataFor: 0.0001,
      transformResponse: (response: IBEMasterTeamDetails) => ({
        name: response.name,
        coaches: response.coaches.map((coach) => ({
          id: coach.id,
          email: coach.email,
          fullName: coach.first_name + ' ' + coach.last_name,
          phone: coach.phone_number,
        })),
        players: response.players.map((player) => ({
          id: player.id,
          email: player.email,
          fullName: player.first_name + ' ' + player.last_name,
          phone: player.phone_number,
        })),
        teamsAdmins: response.team_admins.map((teamAdmin) => ({
          id: teamAdmin.id,
          email: teamAdmin.email,
          fullName: teamAdmin.first_name + ' ' + teamAdmin.last_name,
          phone: teamAdmin.phone_number,
        })),
        headCoach: {
          id: response.head_coach.id,
          email: response.head_coach.email,
          fullName: response.head_coach.first_name + ' ' + response.head_coach.last_name,
          phone: response.head_coach.phone_number,
        },
      }),
    }),

    createMasterTeam: builder.mutation<void, ICreateMTRequest>({
      query: (body) => ({
        url: 'teams/teams/create-team-as-admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: [MASTER_TEAMS_TAG],
    }),

    deleteMasterTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `teams/teams/${id}`,
        method: 'DELETE',
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
  useGetMasterTeamQuery,
  useDeleteMasterTeamMutation,
} = masterTeamsApi

