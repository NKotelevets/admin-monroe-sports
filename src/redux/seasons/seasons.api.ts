import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IPaginationResponse } from '@/common/interfaces/api'
import {
  IBECreateSeasonBody,
  IBESeason,
  IDeleteSeasonsResponse,
  IFESeason,
  IGetSeasonsRequestParams,
  IGetSeasonsResponse,
  IImportSeasonsResponse,
} from '@/common/interfaces/season'
import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'

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
        seasons: data.results.map((season) => (transformKeysToCamelCase({ ...season }))),
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

    updateSeason: builder.mutation<void, { id: string, body: IBECreateSeasonBody }>({
      query: ({ id, body }) => ({
        url: 'teams/seasons/' + id,
        body: transformKeysToSnakeCase(body),
        method: 'PUT',
      }),
    }),

    getSeasonDetails: builder.query<IFESeason, string>({
      query: (id) => ({
        url: `teams/seasons/${id}`,
      }),
      keepUnusedDataFor: 0.0001,

      transformResponse: (response: IBESeason): IFESeason => (
        {...transformKeysToCamelCase(response)}
      ),
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
  useLazyGetSeasonDetailsQuery,
  useCreateSeasonMutation,
  useGetSeasonBEDetailsQuery,
  useLazyGetSeasonBEDetailsQuery,
  useBulkDeleteBracketsMutation,
} = seasonsApi
