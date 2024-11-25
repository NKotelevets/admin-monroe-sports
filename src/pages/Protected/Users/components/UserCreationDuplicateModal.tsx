import { UserReviewModal } from '@/pages/Protected/Users/components/UserReviewModal'
import { IExtendedFEUser, IFENew, IRole } from '@/common/interfaces/user.ts'
import { useBulkEditMutation } from '@/redux/user/user.api.ts'
import { transformKeysToSnakeCase } from '@/utils'
import { calculateUserRoles } from '@/utils/user.ts'
import { ReactElement, useCallback, useMemo } from 'react'
import { IFERole } from '@/common/interfaces/role.ts'
import { IUserBulkEditPayload } from '@/common/types'
import { useNotification } from '@/hooks/useNotification.ts'

const DUPLICATED_MESSAGE = `You cannot create this user as a new. Change the email and phone number to create`
const USER_UPDATED_MESSAGE = `User was successfully updated`

interface IUserCreationDuplicateModalProps {
  existing: IExtendedFEUser[]
  newUser: IFENew
  hasError: boolean

  onClose(): void

  goBack(): void
}

/**
 * `UserCreationDuplicateModal` is a modal component designed to handle the review and management of
 * duplicate user entries during the user creation process. It allows administrators to update an existing
 * user with new information while displaying existing duplicates for comparison.
 *
 * @component
 *
 * @param {IUserCreationDuplicateModalProps} props - The properties for `UserCreationDuplicateModal`.
 * @param {IExtendedFEUser[]} props.existing - Array of existing users to compare against the new user.
 * @param {IFENew} props.newUser - The new user object that may duplicate existing entries.
 * @param {boolean} props.hasError - If `true`, indicates an error occurred during user updates.
 *
 * @param {() => void} props.onClose - Function executed when the modal is closed.
 * @param {() => void} props.goBack - Function executed to return to the previous state or screen.
 *
 * @returns {ReactElement} Rendered `UserCreationDuplicateModal` component.
 *
 * @example
 * <UserCreationDuplicateModal
 *   existing={[user1, user2]}
 *   newUser={newUser}
 *   hasError={false}
 *   onClose={() => setShowModal(false)}
 *   goBack={() => setStep('initial')}
 * />
 */
export const UserCreationDuplicateModal = (props: IUserCreationDuplicateModalProps): ReactElement => {
  const { existing, newUser, onClose, goBack } = props
  const { notify } = useNotification()

  const [bulkEdit, { isLoading, isError, status }] = useBulkEditMutation()

  const current = existing[0]
  const duplicate = Array.from({ length: existing.length }, () => (newUser))

  const currentUserRoles = useMemo((): IRole[] => {
    const calculateEntities = (roleName: string, entities: IFERole['linkedEntities']) => (
      entities?.map(entity => ({ role: roleName, team_id: entity.id })) || []
    )
    return calculateUserRoles(current).reduce(
      (acc, value) => ([
          ...acc,
          ...(calculateEntities(value.name, value.linkedEntities) || [])] as IRole[]
      ), [] as IRole[])
  }, [current])


  const onSubmit = useCallback(async () => {
    const updateUserAsAdminBody = {
      id: current.id,
      roles: [...currentUserRoles, ...newUser.roles]
    }

    await bulkEdit([transformKeysToSnakeCase(updateUserAsAdminBody)] as IUserBulkEditPayload[])
      .then(() => {
        notify(USER_UPDATED_MESSAGE, 'success')
        goBack()
      })
      .catch(() => {
      })
  }, [current, currentUserRoles, newUser])

  return (
    <UserReviewModal
      type="Created"
      title="Review Matches"
      existing={existing}
      duplicates={duplicate}
      hasError={isError && status === 'rejected'}
      primaryButtonAction={onSubmit}
      primaryButtonText="Update Current"
      primaryButtonLoading={isLoading}
      secondaryButtonText="Create New"
      secondaryButtonDisabled={true}
      secondaryButtonTooltip={DUPLICATED_MESSAGE}
      onClose={onClose}
    />
  )
}
