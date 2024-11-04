import Breadcrumb from 'antd/es/breadcrumb'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { editUserValidationSchema, ICreateUserFormValues } from '@/pages/Protected/Users/constants/formik'

import { MonroeBlueText, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import Loader from '@/components/Loader'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useBulkEditMutation, useGetUserDetailsQuery } from '@/redux/user/user.api'

import { calculateUserRoles } from '@/utils/user'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'
import { ICreateUserAsAdmin } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

import UserForm from '@/pages/Protected/Users/components/UserForm.tsx'

const EditUser = () => {
  const params = useParams<{ id: string }>()
  const navigation = useNavigate()

  const [bulkEdit] = useBulkEditMutation()

  const { setAppNotification } = useAppSlice()
  const { data, isLoading, error } = useGetUserDetailsQuery(
    { id: params?.id || '' },
    { skip: !params.id }
  )

  const goBack = () => navigation(PATH_TO_USERS)

  const handleSubmit = (values: ICreateUserAsAdmin) => {
    const updateUserAsAdminBody = {
      id: data!.id,
      roles: values.roles
    }

    bulkEdit([updateUserAsAdminBody])
      .unwrap()
      .then(() => {
        navigation(PATH_TO_USERS)
      })
  }

  useEffect(() => {
    if (!isLoading && !data) {
      setAppNotification({
        message: (error as IDetailedError).details,
        type: 'error'
      })

      goBack()
    }
  }, [data, isLoading])

  if (isLoading || !data) return <Loader />

  const initialValues: ICreateUserFormValues = {
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    email: data.email,
    gender: FULL_GENDER_NAMES[data.gender as TGender],
    phoneNumber: data.phoneNumber,
    zipCode: data.zipCode,
    roles: calculateUserRoles(data)
  }

  const BREAD_CRUMB_ITEMS = [
    { title: <a href={PATH_TO_USERS}>Users</a> },
    { title: <MonroeBlueText>{initialValues.firstName + ' ' + initialValues.lastName}</MonroeBlueText> }
  ]

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Edit User</title>
        </Helmet>

        <PageContainer vertical>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <ProtectedPageTitle>Edit User</ProtectedPageTitle>
          <UserForm
            validationSchema={editUserValidationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            goBack={goBack}
          />
        </PageContainer>
      </>
    </BaseLayout>
  )
}

export default EditUser

