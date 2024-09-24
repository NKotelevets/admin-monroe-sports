import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IGetEntityResponse } from '@/common/interfaces'
import { IPaginationResponse } from '@/common/interfaces/api'
import { IBEOperator, IFEOperator, IGetOperatorRequestParams } from '@/common/interfaces/operator'
import {
  IBEUser,
  IBlockedUserError,
  ICreateUserAsAdminRequestBody,
  IFEUser,
  IGetUsersRequestParams,
} from '@/common/interfaces/user'

const USER_TAG = 'USER'

const OPERATOR_TAG = 'OPERATOR'

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

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [USER_TAG, OPERATOR_TAG],
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
        isActive: user.is_active,
        isSuperuser: user.is_superuser,
        roles: [],
        teams: [],
      }),
    }),
    getUsers: builder.query<IGetEntityResponse<IFEUser>, IGetUsersRequestParams>({
      query: (params) => ({
        url: '/users/list-of-users',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IBEUser[]>) => ({
        count: response.count,
        data: response.results.map((user) => ({
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
          isActive: user.is_active,
          isSuperuser: user.is_superuser,
          roles: user.roles,
          teams: user.teams,
        })),
      }),
      providesTags: [USER_TAG],
    }),
    editUser: builder.mutation<void, { userId: string; body: Partial<IBEUser> }>({
      query: ({ userId, body }) => ({
        url: 'users/' + userId,
        body,
        method: 'PUT',
      }),
      invalidatesTags: [USER_TAG],
    }),

    getOperators: builder.query<IGetEntityResponse<IFEOperator>, IGetOperatorRequestParams>({
      query: (params) => ({
        url: 'users/operator',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IBEOperator[]>) => ({
        count: response.count,
        data: response.results.map(
          ({ phone_number, phone_number_contact, email_contact, first_name, last_name, zip_code, ...rest }) => ({
            ...rest,
            firstName: first_name,
            lastName: last_name,
            emailContact: email_contact,
            zipCode: zip_code,
            phoneNumber: phone_number,
            phoneNumberContact: phone_number_contact,
          }),
        ),
      }),
      providesTags: [OPERATOR_TAG],
    }),

    createUserAsAdmin: builder.mutation<void, ICreateUserAsAdminRequestBody>({
      query: (body) => ({
        url: 'users/operator/create-user-as-admin',
        body,
        method: 'POST',
      }),
    }),

    createOperator: builder.mutation<IBEOperator, Omit<IBEOperator, 'id'>>({
      query: (body) => ({
        url: 'users/operator',
        method: 'POST',
        body,
      }),
      invalidatesTags: [OPERATOR_TAG],
    }),

    bulkBlockUsers: builder.mutation<
      {
        total: number
        success: number
        status: 'red' | 'green' | 'yellow'
        items: IBlockedUserError[]
      },
      string[]
    >({
      query: (ids) => ({
        url: `users/bulk-block-users`,
        body: {
          ids,
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

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
  useEditUserMutation,
  useLazyGetOperatorsQuery,
  useCreateOperatorMutation,
  useBulkBlockUsersMutation,
  useCreateUserAsAdminMutation,
  useGetPrefilledDataQuery,
} = userApi
