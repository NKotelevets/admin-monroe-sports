import UserForm from '@/pages/Protected/Users/components/UserForm'

import { UserCreationDuplicateModal } from '@/pages/Protected/Users/components/UserCreationDuplicateModal.tsx'
import { useCreateUserAsAdminMutation } from '@/redux/user/user.api.ts'
import { useEffect, useState } from 'react'
import {
  ICreateUserAsAdmin,
  ICreateUserAsAdminRequestBody,
  ICreateUserAsAdminResponse,
  IExtendedFEUser,
  IFEDuplicate,
  IRole
} from '@/common/interfaces/user.ts'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_USERS } from '@/common/constants/paths.ts'
import { isFetchBaseQueryError } from '@/utils'
import { MonroeBlueText } from '@/components/Elements'
import { Page } from '@/layouts/Page'
import { useNotification } from '@/hooks/useNotification.ts'

const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_USERS}>Users</a> },
  { title: <MonroeBlueText>Create user</MonroeBlueText> }
]

/**
 * CreateUser Page
 *
 * This component provides an interface for creating a new user in the Admin Panel.
 * It manages form submission, error handling, and duplicate user detection, rendering
 * a modal if a duplicate user is detected.
 *
 * The component utilizes:
 * - React Router's `useNavigate` for navigation after successful user creation.
 * - `useCreateUserAsAdminMutation` to call an API endpoint for user creation as an admin.
 * - A local state, `duplicate`, to store information about an existing user if a duplicate
 *   user error occurs during the API request.
 *
 * Features:
 * - **User Form Submission**: Accepts form data for creating a new user, validates the data,
 *   and sends it to the backend API. If successful, navigates back to the user list.
 * - **Duplicate Detection**: If a duplicate user error is detected, it sets the `duplicate`
 *   state, triggering the display of a `UserCreationDuplicateModal`.
 * - **Modal Display**: The `UserCreationDuplicateModal` shows information about the existing
 *   and new user to handle duplicate cases. It can be closed with the `closeModal` function.
 *
 * @returns A ReactElement with the form itself
 */
const CreateUser = () => {
  const navigation = useNavigate()

  const [createUserAsAdmin, { error, isLoading }] = useCreateUserAsAdminMutation()
  const [duplicate, setDuplicate] = useState<ICreateUserAsAdminResponse>()
  const [selectedRoles, setSelectedRoles] = useState<IRole[]>()

  const { notify } = useNotification()

  useEffect(() => {
    if (error && isFetchBaseQueryError<IFEDuplicate & { exists: IExtendedFEUser[] }>(error)) {
      if (typeof error === 'object' && 'new' in error && 'existing' in error) {
        return setDuplicate({ existing: error.data.exists, new: error.data.new })
      }

      const errorMessage = (error as { data: { error: string } })?.data?.error
        || 'Could not create the user. Please, try again!'

      notify(errorMessage, 'error')
    }
  }, [error])

  const goBack = () => navigation(PATH_TO_USERS)

  const closeModal = () => setDuplicate(undefined)

  const createUser = (values: ICreateUserAsAdmin) => {
    const body = {
      first_name: values.firstName,
      last_name: values.lastName,
      birth_date: values.birthDate,
      gender: values.gender,
      email: values.email,
      phone_number: values.phoneNumber,
      zip_code: values.zipCode,
      roles: values.roles
    } as ICreateUserAsAdminRequestBody

    setSelectedRoles(values.roles)

    createUserAsAdmin(body)
      .unwrap()
      .then(goBack)
      .catch(() => {
      })
  }

  return (
    <>
      {!!duplicate && (
        <UserCreationDuplicateModal
          existing={duplicate.existing}
          newUser={{ ...duplicate.new, roles: selectedRoles || [] }}
          goBack={goBack}
          onClose={closeModal}
          hasError={false}
        />
      )}

      <Page title="Create User" breadcrumbs={BREAD_CRUMB_ITEMS}>
        <UserForm
          isLoading={isLoading}
          onSubmit={createUser}
          goBack={goBack}
        />
      </Page>
    </>
  )
}

export default CreateUser

