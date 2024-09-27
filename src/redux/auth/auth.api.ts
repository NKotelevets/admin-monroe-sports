import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ISignInResponse } from '@/common/interfaces/auth'

interface ISignInRequestBody {
  email: string
  password: string
  isStaySignIn: boolean
}

export interface Root {
  id: string
  email: string
  phone_number: string
  additional_emails: AdditionalEmail[]
  additional_phones: AdditionalPhone[]
  phone_number_verified: boolean
  email_verified: boolean
  invite_accepted: string
  invite_date: string
  operator: Operator
  is_superuser: boolean
  updated_at: string
  created_at: string
  system_role: number
  photo_s3_url: string
  first_name: string
  last_name: string
  birth_date: string
  gender: number
  zip_code: string
  city: string
  state: string
  emergency_contact_name: string
  emergency_contact_phone: string
  is_active: boolean
}

export interface AdditionalEmail {
  email: string
  is_verified: boolean
}

export interface AdditionalPhone {
  phone_number: string
  is_verified: boolean
}

export interface Operator {
  id: string
  updated_at: string
  created_at: string
  name: string
  email: string
  phone_number: string
  zip_code: string
  state: string
  city: string
  street: string
  first_name: string
  last_name: string
  phone_number_contact: string
  email_contact: string
}

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
    getPrefilledData: builder.query<Root, { invitation_token: string }>({
      query: (params) => ({
        url: 'users/get-prefilled-data',
        params,
      }),
    }),
  }),
})

export const { useSignInMutation, useGetPrefilledDataQuery } = authApi
