import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IUser } from '@/common/interfaces/user'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      query: () => ({
        url: '/users/me',
      }),
    }),
  }),
})

export const { useGetUserQuery, useLazyGetUserQuery } = userApi

