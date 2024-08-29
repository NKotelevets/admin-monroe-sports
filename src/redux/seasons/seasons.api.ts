import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBECreateSeasonBody,
  IBESeason,
  ICreateBESeason,
  IDeleteSeasonsResponse,
  IFESeason,
  IGetSeasonsRequestParams,
  IGetSeasonsResponse,
  IImportSeasonsResponse,
} from '@/common/interfaces/season'

const SEASON_TAG = 'SEASON_TAG'

export const seasonsApi = createApi({
  reducerPath: 'seasonsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [SEASON_TAG],
  endpoints: (builder) => ({
    getSeasons: builder.query<IGetSeasonsResponse, IGetSeasonsRequestParams>({
      query: (params) => ({
        url: 'teams/seasons',
        params,
      }),
      providesTags: [SEASON_TAG],
      transformResponse: (data: IPaginationResponse<IBESeason[]>) => ({
        count: data.count,
        seasons: data.results.map((season) => ({
          divisions: season.divisions,
          expectedEndDate: season.expected_end_date,
          id: season.id,
          league: season.league,
          name: season.name,
          startDate: season.start_date,
          createdAt: season!.created_at as string,
          updatedAt: season!.updated_at as string,
        })),
      }),
    }),
    deleteSeason: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: 'teams/seasons/' + id,
        method: 'DELETE',
      }),
      invalidatesTags: [SEASON_TAG],
    }),
    bulkSeasonsDelete: builder.mutation<IDeleteSeasonsResponse, { ids: string[] }>({
      query: ({ ids }) => ({
        url: 'teams/seasons/bulk-seasons-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
      invalidatesTags: [SEASON_TAG],
    }),
    deleteAllSeasons: builder.mutation<IDeleteSeasonsResponse, void>({
      query: () => ({
        url: 'teams/seasons/delete_all',
        method: 'POST',
      }),
      invalidatesTags: [SEASON_TAG],
    }),
    importSeasonsCSV: builder.mutation<IImportSeasonsResponse, FormData>({
      query: (body) => ({
        url: 'teams/seasons/import-seasons',
        body,
        method: 'POST',
      }),
      invalidatesTags: [SEASON_TAG],
    }),
    updateSeason: builder.mutation<
      void,
      {
        id: string
        body: ICreateBESeason
      }
    >({
      query: ({ id, body }) => ({
        url: 'teams/seasons/' + id,
        body,
        method: 'PUT',
      }),
    }),
    getSeasonDetails: builder.query<IFESeason, string>({
      query: (id) => ({
        url: `teams/seasons/${id}`,
      }),
      keepUnusedDataFor: 0.0001,

      transformResponse: (response: IBESeason): IFESeason => ({
        createdAt: response.created_at as string,
        divisions: response.divisions,
        expectedEndDate: response.expected_end_date,
        id: response.id,
        league: response.league,
        name: response.name,
        startDate: response.start_date,
        updatedAt: response.updated_at as string,
      }),
    }),
    getSeasonBEDetails: builder.query<IBESeason, string>({
      query: (id) => ({
        url: `teams/seasons/${id}`,
      }),
    }),
    createSeason: builder.mutation<void, IBECreateSeasonBody>({
      query: (body) => ({
        url: 'teams/seasons',
        method: 'POST',
        body,
      }),
    }),
    bulkDeleteBrackets: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: 'teams/brackets/bulk-bracket-delete',
        method: 'POST',
        body: {
          ids,
        },
      }),
    }),
  }),
})

export const {
  useLazyGetSeasonsQuery,
  useDeleteSeasonMutation,
  useBulkSeasonsDeleteMutation,
  useDeleteAllSeasonsMutation,
  useImportSeasonsCSVMutation,
  useUpdateSeasonMutation,
  useGetSeasonDetailsQuery,
  useCreateSeasonMutation,
  useGetSeasonBEDetailsQuery,
  useLazyGetSeasonBEDetailsQuery,
  useBulkDeleteBracketsMutation,
} = seasonsApi
