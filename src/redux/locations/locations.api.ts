import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery.ts'

import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'

import { ILocation } from '@/common/interfaces/location.ts'
import { TListLocationRequest, TListLocationResponse } from '@/common/types/events'
import { TLocationForm } from '@/common/types/location.ts'

const LOCATIONS_TAG = 'LOCATIONS'

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [LOCATIONS_TAG],
  endpoints: (builder) => ({
    /**
     * Fetches a list of game locations based on the provided request parameters.
     *
     * Queries the `games/locations` endpoint with the given parameters, transforms the
     * response keys to camelCase format, and returns the formatted response.
     *
     * @param {TListLocationRequest} params - The request parameters used to filter the locations.
     * @returns {TListLocationResponse} The transformed response containing the list of locations.
     *
     * This query provides a cache tag defined by `LOCATIONS_TAG` that can be used for invalidation
     * or refetching purposes.
     */
    listLocation: builder.query<TListLocationResponse, TListLocationRequest>({
      query: (params) => ({
        url: `games/locations`,
        params,
      }),
      transformResponse: (response: TListLocationResponse) => transformKeysToCamelCase(response),
      providesTags: [LOCATIONS_TAG],
    }),
    /**
     * Fetches the location details for a specific game location.
     *
     * @type {function}
     * @param {Object} args - The parameters for the query.
     * @param {string} args.id - The unique identifier of the location.
     * @returns {Object} - Returns the query configuration, including the API endpoint and response transformation.
     *
     * The function:
     * - Sends a request to the endpoint `games/locations/{id}` to retrieve details of a specific game location.
     * - Transforms the API response to camelCase using the `transformKeysToCamelCase` utility.
     * - Provides cache tags for the queried location under `LOCATIONS_TAG`.
     */
    getLocation: builder.query<ILocation, { id: string }>({
      query: ({ id }) => ({
        url: `games/locations/${id}`,
      }),
      transformResponse: (response: ILocation) => transformKeysToCamelCase(response),
      providesTags: [LOCATIONS_TAG],
    }),
    /**
     * Mutation function to create a new game location.
     * Sends a POST request to the 'games/locations' endpoint with the provided
     * location data transformed to use snake_case keys.
     *
     * @param {TLocationForm} body - The payload containing the location data to be created.
     * @returns {ILocation} The newly created location details.
     *
     * This mutation invalidates the `LOCATIONS_TAG` to refresh any related cached data.
     */
    createLocation: builder.mutation<ILocation, TLocationForm>({
      query: (body) => ({
        url: 'games/locations',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      invalidatesTags: [LOCATIONS_TAG],
    }),
    /**
     * Mutation for editing an existing location.
     *
     * This function sends a POST request to update a specific location identified by its id.
     * The request body is transformed to use snake_case keys before being sent.
     * On a successful update, it invalidates the cache for locations to ensure updated data is fetched.
     *
     * @param {Object} options - The mutation options.
     * @param {string} options.id - The unique identifier of the location to be updated.
     * @param {TLocationForm} options.body - The data to update the location, structured as an object.
     * @returns {ILocation} The updated location data.
     */
    editLocation: builder.mutation<ILocation, { id: string; body: TLocationForm }>({
      query: ({ id, body }) => ({
        url: `games/locations${id}`,
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      invalidatesTags: [LOCATIONS_TAG],
    }),
  }),
})

export const {
  useLazyListLocationQuery,
  useGetLocationQuery,
  useLazyGetLocationQuery,
  useCreateLocationMutation,
  useEditLocationMutation,
} = locationsApi
