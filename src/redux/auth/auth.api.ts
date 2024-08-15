import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ISignInResponse } from '@/common/interfaces/auth'

interface ISignInRequestBody {
  email: string
  password: string
  isStaySignIn: boolean
}

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  endpoints: (build) => ({
    signIn: build.mutation<ISignInResponse, ISignInRequestBody>({
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
  }),
})

export const { useSignInMutation } = authApi
