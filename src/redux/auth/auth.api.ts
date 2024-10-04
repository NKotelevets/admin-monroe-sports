import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import {
  ICreateUserBody,
  IPrefilledData,
  ISignInRequestBody,
  ISignInResponse,
  IUpdateOperator,
} from '@/common/interfaces/auth'
import { IBEOperator } from '@/common/interfaces/operator'

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
  }),
})

export const { useSignInMutation, useGetPrefilledDataQuery, useCreateUserMutation, useUpdateOperatorMutation } = authApi
