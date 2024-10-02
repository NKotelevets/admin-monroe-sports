import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { IGetEntityResponse } from '@/common/interfaces'
import { IPaginationResponse } from '@/common/interfaces/api'
import { IBEOperator, IFEOperator, IGetOperatorRequestParams } from '@/common/interfaces/operator'
import {
  IBEUser,
  IBlockedUserError,
  ICreateUserAsAdminRequestBody,
  IExtendedBEUser,
  IExtendedFEUser,
  IFEUser,
  IGetUsersRequestParams,
  IRole,
} from '@/common/interfaces/user'

const USER_TAG = 'USER'

const OPERATOR_TAG = 'OPERATOR'

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

    getUserDetails: builder.query<IExtendedFEUser, { id: string }>({
      query: ({ id }) => ({
        url: 'users/' + id + '/profile',
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (user: IExtendedBEUser) => ({
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
        asCoach: user.as_coach,
        asPlayer: user.as_player,
        operator: user.operator,
        asHeadCoach: user.as_head_coach,
        asTeamAdmin: user.as_team_admin,
        isChild: user.is_child,
        asParent:
          user.as_supervisor?.supervised.map((s) => ({
            id: s.id,
            firstName: s.first_name,
            lastName: s.last_name,
          })) || null,
      }),
      providesTags: [USER_TAG],
    }),

    getUsers: builder.query<IGetEntityResponse<IExtendedFEUser>, IGetUsersRequestParams>({
      query: (params) => ({
        url: '/users/list-of-users',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IExtendedBEUser[]>) => ({
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
          asCoach: user.as_coach,
          asPlayer: user.as_player,
          operator: user.operator,
          asHeadCoach: user.as_head_coach,
          asTeamAdmin: user.as_team_admin,
          isChild: user.is_child,
          asParent:
            user.as_supervisor?.supervised.map((s) => ({
              id: s.id,
              firstName: s.first_name,
              lastName: s.last_name,
            })) || null,
        })),
      }),
      providesTags: [USER_TAG],
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
      invalidatesTags: [USER_TAG],
    }),

    bulkEdit: builder.mutation<
      {
        total: number
        success: number
        status: 'red' | 'green' | 'yellow'
        failed: []
      },
      {
        id: string
        roles?: IRole[]
        is_active?: boolean
      }[]
    >({
      query: (users) => ({
        url: 'users/operator/bulk-edit-roles-as-admin',
        body: {
          users,
        },
        method: 'POST',
      }),
      invalidatesTags: [USER_TAG],
    }),

    importUsersCSV: builder.mutation<void, FormData>({
      query: (body) => ({
        method: 'POST',
        url: 'users/confirmation/import-users-from-csv',
        body,
      }),
    }),
  }),
})

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
  useLazyGetOperatorsQuery,
  useCreateOperatorMutation,
  useBulkBlockUsersMutation,
  useCreateUserAsAdminMutation,
  useGetUserDetailsQuery,
  useBulkEditMutation,
  useImportUsersCSVMutation,
} = userApi
