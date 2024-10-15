import { createApi } from '@reduxjs/toolkit/query/react'

import baseQueryWithReAuth from '@/redux/reauthBaseQuery'

import { getFENewRecord, getFEUserRecord } from '@/utils/user'

import { IGetEntityResponse } from '@/common/interfaces'
import { IPaginationResponse } from '@/common/interfaces/api'
import { IBEOperator, IFEOperator, IGetOperatorRequestParams } from '@/common/interfaces/operator'
import {
  IBEImportUsersCSVResponse,
  IBlockedUserError,
  IBulkEditError,
  ICreateUserAsAdminRequestBody,
  IExtendedBEUser,
  IExtendedFEUser,
  IFEImportUsersCSVResponse,
  IGetUsersRequestParams,
  IRole,
} from '@/common/interfaces/user'
import { TDeleteStatus } from '@/common/types'

const USER_TAG = 'USER'
const OPERATOR_TAG = 'OPERATOR'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [USER_TAG, OPERATOR_TAG],
  endpoints: (builder) => ({
    getUser: builder.query<IExtendedFEUser, void>({
      query: () => ({
        url: '/users/me',
      }),
      transformResponse: (user: IExtendedBEUser) => getFEUserRecord(user),
    }),

    getUserDetails: builder.query<IExtendedFEUser, { id: string }>({
      query: ({ id }) => ({
        url: 'users/' + id + '/profile',
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (user: IExtendedBEUser) => getFEUserRecord(user),
      providesTags: [USER_TAG],
    }),

    getUsers: builder.query<IGetEntityResponse<IExtendedFEUser>, IGetUsersRequestParams>({
      query: (params) => ({
        url: '/users/list-of-users',
        params,
      }),
      transformResponse: (response: IPaginationResponse<IExtendedBEUser[]>) => ({
        count: response.count,
        data: response.results.map(getFEUserRecord),
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
        status: TDeleteStatus
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
        status: TDeleteStatus
        failed: IBulkEditError[]
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

    importUsersCSV: builder.mutation<IFEImportUsersCSVResponse, FormData>({
      query: (body) => ({
        method: 'POST',
        url: 'users/confirmation/import-users-from-csv-as-admin',
        body,
      }),
      invalidatesTags: [USER_TAG],
      transformResponse: ({ duplicates, ...rest }: IBEImportUsersCSVResponse) => ({
        ...rest,
        duplicates: duplicates.map((d) => ({
          existing: getFEUserRecord(d.existing),
          new: getFENewRecord(d.new),
        })),
      }),
    }),

    sendInvitation: builder.mutation<
      void,
      {
        id: string
      }
    >({
      query: ({ id }) => ({
        url: `users/invitation/${id}/resend-invitation-as-admin`,
        method: 'POST',
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
  useSendInvitationMutation,
} = userApi
