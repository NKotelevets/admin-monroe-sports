import { IExtendedFEUser, IFENew } from '@/common/interfaces/user.ts'
import { useBulkEditMutation } from '@/redux/user/user.api.ts'
import { transformKeysToSnakeCase } from '@/utils'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { IUserBulkEditPayload } from '@/common/types'
import { useNotification } from '@/hooks/useNotification.ts'
import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal'
import UserDuplicateReview from '@/pages/Protected/Users/components/UserDuplicateReview.tsx'
import { DefaultButton } from '@/components/DuplicateReviewModal/components'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import { getCurrentRole } from '@/pages/Protected/Users/utils'
import { TLinkedRole } from '@/common/types/users.ts'

const MAIN_BUTTON_TEXT = `Update Current`
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const current = existing[selectedIndex]
  const newData = Array.from({ length: existing.length }, () => (newUser))
  const duplicates = existing.map((record, idx) => (
    { idx, existing: record, new: newData[idx] }
  ))

  const currentRoles = useMemo(() => (
    selectedIndex !== null ? getCurrentRole(duplicates[selectedIndex].existing) : []
  ), [selectedIndex, duplicates])

  const onUpdate = useCallback(async () => {
    const updateUserAsAdminBody = {
      id: current.id,
      roles: [...currentRoles, ...newUser.roles]
    }

    await bulkEdit([transformKeysToSnakeCase(updateUserAsAdminBody)] as IUserBulkEditPayload[])
      .then(() => {
        notify(USER_UPDATED_MESSAGE, 'success')
        goBack()
      })
      .catch(() => {
        // error handled by modal
      })
  }, [current, currentRoles, newUser])

  const onChange = (index: number) => {
    setSelectedIndex(index)
  }

  const renderCustomButton = () => (
    <MonroeTooltip text={DUPLICATED_MESSAGE} width={`240px`}>
      <DefaultButton type="default" disabled={true}>
        Create New
      </DefaultButton>
    </MonroeTooltip>
  )

  return (
    createPortal((
      <DuplicateReviewModal<IFENew, IExtendedFEUser>
        idx={0}
        hideSkipButton
        buttonSize={140}
        isLoading={isLoading}
        duplicates={duplicates}
        success={status === 'fulfilled'}
        error={isError || status === 'rejected'}
        mainButtonText={MAIN_BUTTON_TEXT}
        onClose={onClose}
        onChange={onChange}
        handleUpdate={onUpdate}
        customButton={renderCustomButton}
      >
        {(index: number) => (
          <UserDuplicateReview
            index={index}
            duplicates={duplicates}
            linkedRoles={currentRoles}
            newRoles={newUser.roles as TLinkedRole[]}
          />
        )}
      </DuplicateReviewModal>
    ), document.getElementById('page-portal')!)
  )
}
