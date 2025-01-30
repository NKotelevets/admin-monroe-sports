import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery.ts'

import { transformKeysToSnakeCase } from '@/utils'

const ACCOUNT_TAG = 'ACCOUNT_TAG'

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [ACCOUNT_TAG],
  endpoints: (builder) => ({
    logIn: builder.mutation<void, { email: string; password: string }>({
      query: (body) => ({
        url: 'users/start-reset-password',
        method: 'POST',
        body: transformKeysToSnakeCase(body),
      }),
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
  }),
})

export const { useRequestResetPasswordMutation, useResetPasswordMutation, useLogInMutation } = accountApi
