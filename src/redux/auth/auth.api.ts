import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import {
  ICreateUserBody,
  IPrefilledData,
  ISignInRequestBody,
  ISignInResponse,
  IUpdateOperator,
} from '@/common/interfaces/auth'
import { IBEOperator } from '@/common/interfaces/operator'
import { TChildData } from '@/common/types/users.ts'
import { removeEmptyStringAttributes } from '@/utils'

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<ISignInResponse, ISignInRequestBody>({
      query: ({ email, isStaySignIn, password }) => ({
        url: '/users/login/',
        body: {
          email,
          password,
          stay_logged_in: isStaySignIn,
        },
        method: 'POST',
      }),
    }),

    getPrefilledData: builder.query<IPrefilledData, { invitation_token: string }>({
      query: (params) => ({
        url: 'users/get-prefilled-data',
        params,
      }),
    }),

    createUser: builder.mutation<void, { id: string; body: ICreateUserBody }>({
      query: ({ body, id }) => ({
        url: `users/${id}/profile`,
        body,
        method: 'POST',
      }),
    }),

    updateOperator: builder.mutation<
      IBEOperator,
      {
        id: string
        body: IUpdateOperator
      }
    >({
      query: ({ body, id }) => ({
        url: `users/operator/${id}`,
        body,
        method: 'PUT',
      }),
    }),

    /**
     * Sends a request to accept an invitation using the provided invite ID and optional user IDs.
     *
     * @function
     * @name acceptInvite
     * @param {Object} body - The payload for the request.
     * @param {string} body.invite_id - The ID of the invitation to accept.
     * @param {string[]} [body.users_ids] - Optional array of user IDs associated with the invitation.
     * @returns {void}
     */
    acceptInvite: builder.mutation<void, { invite_id: string; users_ids?: string[]; password?: string, child_object?: TChildData }>({
      query: (body) => {
        const _body = removeEmptyStringAttributes(body)

        return ({
          url: 'users/accept-invite',
          body: _body,
          method: 'POST',
        })
      },
    }),
  }),
})

export const {
  useSignInMutation,
  useGetPrefilledDataQuery,
  useCreateUserMutation,
  useUpdateOperatorMutation,
  useAcceptInviteMutation,
} = authApi
