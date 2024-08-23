import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IGetEntityResponse } from '@/common/interfaces'
import { IPaginationResponse } from '@/common/interfaces/api'
import { IBEUser, IFEUser } from '@/common/interfaces/user'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getUser: builder.query<IFEUser, void>({
      query: () => ({
        url: '/users/me',
      }),
      transformResponse: (user: IBEUser) => ({
        id: user.id,
        email: user.email,
        gender: user.gender,
        city: user.city,
        state: user.state,
        phoneNumber: user.phone_number,
        phoneNumberVerified: user.phone_number_verified,
        emailVerified: user.email_verified,
        inviteAccepted: user.invite_accepted,
        inviteDate: user.invite_date,
        updatedAt: user.updated_at,
        createdAt: user.created_at,
        photoS3Url: user.photo_s3_url,
        firstName: user.first_name,
        lastName: user.last_name,
        birthDate: user.birth_date,
        zipCode: user.zip_code,
        emergencyContactName: user.emergency_contact_name,
        emergencyContactPhone: user.emergency_contact_phone,
        roles: [
          {
            name: 'Operator',
            linkedEntities: [],
          },
          {
            name: 'Player',
            linkedEntities: ['Team 1', 'Team 2'],
          },
        ],
      }),
    }),
    getUsers: builder.query<
      IGetEntityResponse<IFEUser>,
      {
        limit: number
        offset: number
        ordering?: string
      }
    >({
      query: (params) => ({
        url: '/users/',
        params,
      }),
      transformResponse: (users: IPaginationResponse<IBEUser[]>) => ({
        count: users.count,
        data: users.results.map((user) => ({
          id: user.id,
          email: user.email,
          gender: user.gender,
          city: user.city,
          state: user.state,
          phoneNumber: user.phone_number,
          phoneNumberVerified: user.phone_number_verified,
          emailVerified: user.email_verified,
          inviteAccepted: user.invite_accepted,
          inviteDate: user.invite_date,
          updatedAt: user.updated_at,
          createdAt: user.created_at,
          photoS3Url: user.photo_s3_url,
          firstName: user.first_name,
          lastName: user.last_name,
          birthDate: user.birth_date,
          zipCode: user.zip_code,
          emergencyContactName: user.emergency_contact_name,
          emergencyContactPhone: user.emergency_contact_phone,
          roles: [
            {
              name: 'Operator',
              linkedEntities: [],
            },
            {
              name: 'Player',
              linkedEntities: ['Team 1', 'Team 2'],
            },
          ],
        })),
      }),
    }),
  }),
})

export const { useGetUserQuery, useLazyGetUserQuery, useLazyGetUsersQuery } = userApi
