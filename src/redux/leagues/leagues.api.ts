import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBECreateLeagueBody,
  IBELeague,
  IBEUpdateLeagueBody,
  IFELeague,
  IGetLeaguesRequestParams,
  IGetLeaguesResponse,
  IImportLeagueResponse,
  ILeagueBulkDeleteResponse,
} from '@/common/interfaces/league'
import { leagueResponseMapper } from './mapper'

const LEAGUE_TAG = 'LEAGUE_TAG'

export const leaguesApi = createApi({
  reducerPath: 'leaguesApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [LEAGUE_TAG],
  endpoints: (builder) => ({
    getLeagues: builder.query<IGetLeaguesResponse, IGetLeaguesRequestParams>({
      query: (params) => ({
        url: 'teams/leagues',
        params,
      }),
      transformResponse: (data: IPaginationResponse<IBELeague[]>) => {
        return ({
          count: data?.count || 0,
          leagues: data.results.map(leagueResponseMapper) as IFELeague[],
        })
      },
      providesTags: [LEAGUE_TAG],
    }),
    getLeague: builder.query<IFELeague, string>({
      query: (id) => ({
        url: 'teams/leagues/' + id,
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (league: IBELeague) => leagueResponseMapper(league) as IFELeague,
    }),
    createLeague: builder.mutation<IBELeague, IBECreateLeagueBody>({
      query: (body) => ({
        url: 'teams/leagues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    updateLeague: builder.mutation<void, { id: string; body: IBECreateLeagueBody }>({
      query: ({ id, body }) => ({
        url: `teams/leagues/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    deleteLeague: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `teams/leagues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    bulkDeleteLeagues: builder.mutation<ILeagueBulkDeleteResponse, { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/leagues/bulk-leagues-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    deleteAllLeagues: builder.mutation<ILeagueBulkDeleteResponse, void>({
      query: () => ({
        url: 'teams/leagues/delete_all',
        method: 'POST',
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
    bulkUpdateLeagues: builder.mutation<void, IBEUpdateLeagueBody[]>({
      query: (body) => ({
        url: 'teams/leagues/bulk-update',
        method: 'POST',
        body,
      }),
    }),
    importLeaguesCSV: builder.mutation<IImportLeagueResponse, FormData>({
      query: (body) => ({
        url: 'teams/leagues/import-leagues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [LEAGUE_TAG],
    }),
  }),
})

export const {
  useCreateLeagueMutation,
  useDeleteLeagueMutation,
  useUpdateLeagueMutation,
  useGetLeaguesQuery,
  useLazyGetLeaguesQuery,
  useLazyGetLeagueQuery,
  useGetLeagueQuery,
  useBulkDeleteLeaguesMutation,
  useDeleteAllLeaguesMutation,
  useImportLeaguesCSVMutation,
  useBulkUpdateLeaguesMutation,
} = leaguesApi
