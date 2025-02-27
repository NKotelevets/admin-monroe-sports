import { createApi } from '@reduxjs/toolkit/query/react'

import { TSignUpForm, TSignUpResponse, TSignUpResponseRaw } from '@/pages/Account/SignUp/types.ts'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery.ts'

import { transformKeysToCamelCase, transformKeysToSnakeCase } from '@/utils'

import { IBEPrefilledUserData, IInvite, IPrefilledUserData } from '@/common/interfaces/user.ts'
import {
  TCreateSupervisedUserPayload,
  TCreateSupervisedUserResponse,
  TSendInvitePayload
} from '@/common/types/account.ts'

const ACCOUNT_TAG = 'ACCOUNT_TAG'

/**
 * API service configuration for handling account-related operations.
 *
 * Provides a set of endpoints for user registration, password management,
 * team invitations, and other account-related functionalities. Implements
 * error handling, response transformations, and cache invalidation for optimized usage.
 *
 * This API service uses a predefined base query with authentication and
 * re-authentication strategies.
 *
 * @namespace accountApi
 * @property {string} reducerPath - The unique key for this slice in the Redux store.
 * @property {function} baseQuery - The base query function for making API requests.
 * @property {Array} tagTypes - The tags used for cache invalidation in account-related operations.
 */
export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [ACCOUNT_TAG],
  endpoints: (builder) => ({
    /**
     * A mutation for user registration.
     *
     * Sends a POST request to register a new user.
     *
     * @function
     * @param {TSignUpForm} body - The data for user registration.
     * @return {TSignUpResponse} The response after processing the registration.
     * @property {function} query - Configures the API request, transforming request keys to snake_case.
     * @property {function} transformResponse - Transforms response keys to camelCase.
     * @property {Array} invalidatesTags - Tags invalidated after the mutation.
     */
    signUp: builder.mutation<TSignUpResponse, TSignUpForm>({
      query: (body) => ({
        url: 'users/register',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      transformResponse: (response: TSignUpResponseRaw) => transformKeysToCamelCase(response),
      invalidatesTags: [ACCOUNT_TAG],
    }),
    /**
     * Mutation to request a password reset for a user.
     * Sends a POST request to the 'users/start-reset-password' endpoint
     * with the user's email in the request body, formatted in snake_case.
     * Invalidates the ACCOUNT_TAG cache upon a successful mutation.
     *
     * @function
     * @param {Object} body - The body of the request.
     * @param {string} body.email - The email address of the user requesting the password reset.
     * @returns {void}
     */
    requestResetPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: 'users/start-reset-password',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      invalidatesTags: [ACCOUNT_TAG],
    }),
    /**
     * Mutation for resetting a user's password.
     * Sends a POST request to the 'users/finish-reset-password' endpoint with the new password and token.
     *
     * The request body is processed through `transformKeysToSnakeCase` to ensure the correct format.
     *
     * This mutation invalidates any data associated with the ACCOUNT_TAG, prompting a re-fetch of relevant queries.
     *
     * @param newPassword - The new password to set for the user.
     * @param token - The reset token required to authorize the password reset.
     */
    resetPassword: builder.mutation<void, { newPassword: string; token: string }>({
      query: (body) => ({
        url: 'users/finish-reset-password',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      invalidatesTags: [ACCOUNT_TAG],
    }),
    /**
     * Fetches a list of invites for available teams a user can join.
     *
     * @param {Object} params - The query parameters.
     * @param {string} params.id - The ID of the user to fetch invites for.
     * @return {Object} A query object for retrieving the invite list.
     */
    inviteList: builder.query<IInvite[], { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}/available-teams-to-join`,
        method: 'GET',
      }),
    }),
    /**
     * Fetches team information associated with a given invitation ID.
     *
     * @function
     * @name getInviteById
     * @param {Object} args - The arguments object.
     * @param {string} args.id - The invitation ID.
     * @returns {Object} Query configuration for fetching the team info.
     */
    getInviteById: builder.query<IInvite, { id: string }>({
      query: ({ id }) => ({
        url: `users/get-team-info-by-invitation-id?invite_id=${decodeURIComponent(id)}`,
        method: 'GET',
      }),
    }),
    /**
     * Fetches user information based on a token (sent to user's email).
     *
     * @function
     * @name getInviteById
     * @param {Object} args - The arguments object.
     * @param {string} args.token - The invitation token.
     * @returns {Object} Query configuration for fetching the team info.
     */
    getPrefilledData: builder.query<IPrefilledUserData, { token: string }>({
      query: ({ token }) => ({
        url: `users/get-prefilled-data?invitation_token=${decodeURIComponent(token)}`,
        method: 'GET',
      }),
      transformResponse: (response: IBEPrefilledUserData) => transformKeysToCamelCase(response),
    }),
    /**
     * Mutation for sending an invitation to a user.
     *
     * @function sendInvite
     * @memberof builder.mutation
     * @param {Object} body - The request payload containing invitation details.
     * @returns {Object} Query configuration for the API call.
     */
    sendInvite: builder.mutation<unknown, TSendInvitePayload>({
      query: (body) => ({
        url: `users/invitation/send-invitation`,
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
    }),
    createSupervisedUser: builder.mutation<TCreateSupervisedUserResponse, TCreateSupervisedUserPayload>({
      query: (body) => ({
        url: `users/create-supervised`,
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
      transformResponse: (response: TCreateSupervisedUserResponse) => transformKeysToCamelCase(response),
    }),

    /**
     * Mutation to deny an invitation for a user.
     *
     * @function
     * @name denyInvite
     * @param {Object} body - The request body.
     * @param {string} body.userId - The ID of the user declining the invite.
     * @param {string} body.inviteId - The ID of the invite to be declined.
     * @param {string[]} [body.usersIds] - Optional array of user IDs related to the invite.
     * @returns {void}
     */
    denyInvite: builder.mutation<void, { userId: string; inviteId: string; usersIds?: string[] }>({
      query: (body) => ({
        url: `users/${body.userId}/decline-invite`,
        body: { users_ids: body.usersIds, invite_id: body.inviteId },
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useRequestResetPasswordMutation,
  useResetPasswordMutation,
  useSignUpMutation,
  useLazyGetPrefilledDataQuery,
  useLazyGetInviteByIdQuery,
  useLazyInviteListQuery,
  useSendInviteMutation,
  useCreateSupervisedUserMutation,
  useDenyInviteMutation
} = accountApi
