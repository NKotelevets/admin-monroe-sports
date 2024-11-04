import { UserReviewModal } from '@/pages/Protected/Users/components/UserReviewModal'
import { IExtendedFEUser, IFENew, IRole } from '@/common/interfaces/user.ts'
import { useBulkEditMutation } from '@/redux/user/user.api.ts'
import { transformKeysToSnakeCase } from '@/utils'
import { calculateUserRoles } from '@/utils/user.ts'
import { useMemo } from 'react'
import { IFERole } from '@/common/interfaces/role.ts'

const DUPLICATED_MESSAGE = `You cannot create this user as a new. Change the email and phone number to create`

interface IUserCreationDuplicateModalProps {
  current: IExtendedFEUser
  duplicate: IFENew

  onClose(): void

  hasError: boolean
}

export const UserCreationDuplicateModal = (props: IUserCreationDuplicateModalProps) => {
  const { current, duplicate, onClose } = props
  const [bulkEdit, { isLoading, isError, status }] = useBulkEditMutation()

  const currentUserRoles = useMemo((): IRole[]  => {
    const calculateEntities = (roleName: string, entities: IFERole['linkedEntities']) => (
      entities?.map(entity => ({ role: roleName, team_id: entity.id })) || []
    )
    return calculateUserRoles(current).reduce(
      (acc, value) => ([
        ...acc,
        ...(calculateEntities(value.name, value.linkedEntities) || [])] as IRole[]
      ), [] as IRole[])
  }, [current])

  const onPrimaryButtonAction = async () => {
    const updateUserAsAdminBody = {
      id: current.id,
      roles: [...currentUserRoles, ...duplicate.roles],
    }

    // @ts-expect-error wip
    await bulkEdit([transformKeysToSnakeCase(updateUserAsAdminBody)])
  }

  return (
    <UserReviewModal
      type="Created"
      title="Review Matches"
      current={current}
      duplicate={duplicate}
      hasError={isError && status === 'rejected'}
      primaryButtonAction={onPrimaryButtonAction}
      primaryButtonText="Update Current"
      primaryButtonLoading={isLoading}
      secondaryButtonAction={alert}
      secondaryButtonText="Create New"
      secondaryButtonDisabled={true}
      secondaryButtonTooltip={DUPLICATED_MESSAGE}
      onClose={onClose}
    />
  )
}
