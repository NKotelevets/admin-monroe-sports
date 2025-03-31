import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal'
import { IExtendedFEUser, IFENew, IRole } from '@/common/interfaces/user.ts'
import UserDuplicateReview from '@/pages/Protected/Users/components/UserDuplicateReview.tsx'
import { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { getCurrentRole, matchedRolesTeams } from '@/pages/Protected/Users/utils'
import { TNewUser, TNewUserRoles } from '@/common/types/users.ts'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useBulkEditMutation } from '@/redux/user/user.api.ts'
import { IDuplicate } from '@/common/interfaces'

type TUserDuplicate = Omit<IDuplicate<IFENew, IExtendedFEUser>, 'differences'>

interface IDuplicateReviewProps {
  selectedIndex: number
  duplicates: TUserDuplicate[]

  setSelectedIndex(index: number | null): void

  removeDuplicate(index: number): void
}

/**
 * UserImportDuplicateModal Component
 *
 * This component manages the review and resolution of duplicate user entries in a modal, allowing for role updates and duplicate removal.
 *
 * @param {IDuplicateReviewProps} props - The properties for the UserImportDuplicateModal component, including:
 * - `selectedIndex`: The index of the selected duplicate user entry.
 * - `duplicates`: An array of user duplicates, each containing existing and new user data.
 * - `setSelectedIndex`: A function to update the `selectedIndex`, or set it to `null` to close the modal.
 * - `removeDuplicate`: A function to remove a duplicate entry by its index.
 *
 * @returns {ReactElement} A JSX element rendered as a modal via `createPortal` for reviewing and updating user duplicates.
 *
 * @description
 * - Uses `useBulkEditMutation` to handle bulk updates for user roles and `useLazyGetMasterTeamsQuery` to fetch team details.
 * - Defines helper functions:
 *   - `onClose`: Closes the modal by resetting `selectedIndex`.
 *   - `onChange`: Updates `selectedIndex` to switch between duplicate entries.
 *   - `onSkip`: Removes the current duplicate entry and moves to the next.
 *   - `fetchRolesWithTeams`: Fetches roles with associated team IDs from the API.
 *   - `onUpdate`: Updates user roles by combining existing roles with newly fetched roles and performing a bulk edit.
 *
 * @modals
 * - Uses `DuplicateReviewModal` to display the duplicate review interface.
 * - Renders `UserDuplicateReview` for reviewing individual duplicate entries, showing current and new roles.
 *
 * @api
 * - `useBulkEditMutation`: A hook to handle mutations for updating user roles.
 * - `useLazyGetMasterTeamsQuery`: A hook for fetching team information asynchronously.
 *
 * @portal
 * - Renders the modal into a DOM element with the ID `page-portal` using `createPortal`.
 */
export const UserImportDuplicateModal = (props: IDuplicateReviewProps): ReactElement => {
  const { duplicates, selectedIndex, setSelectedIndex, removeDuplicate } = props
  const [bulkEdit, { isLoading, isError, status, reset }] = useBulkEditMutation()
  const [getMasterTeams] = useLazyGetMasterTeamsQuery()

  useEffect(() => {
    reset()
  }, [selectedIndex, duplicates])

  const currentRoles = useMemo(() => (
    selectedIndex !== null ? getCurrentRole(duplicates[selectedIndex].existing) : []
  ), [selectedIndex, duplicates])

  const newRoles = useMemo(() => (
    selectedIndex !== null ? matchedRolesTeams(duplicates[selectedIndex].new.roles as TNewUser['roles']) : []
  ), [selectedIndex, duplicates])

  const onClose = () => setSelectedIndex(null)

  const onChange = (index: number) => {
    setSelectedIndex(index)
  }

  const onSkip = (index: number, next: number | null) => {
    setSelectedIndex(next)
    removeDuplicate(index)
  }

  const fetchRolesWithTeams = (newRoles: TNewUserRoles) => (
    Promise.all(
      newRoles.map(async ({ role, teamName }) => {
        const teams = await getMasterTeams({
          limit: 1, offset: 10, name: teamName
        }).unwrap()

        const team_id = teams.results.length > 0 ? teams.results[0].id : ''
        return { role: role, teamName, team_id }
      })
    )
  )

  const onUpdate = useCallback(async (index: number) => {
    if (!duplicates[index]) return

    const newRolesWithTeams: IRole[] = await fetchRolesWithTeams(newRoles)

    const updateUserAsAdminBody = {
      id: duplicates[index].existing.id,
      roles: [...currentRoles, ...newRolesWithTeams]
    }

    await bulkEdit([updateUserAsAdminBody])
  }, [duplicates, currentRoles, newRoles])

  return (
    createPortal(
      <DuplicateReviewModal<IFENew, IExtendedFEUser>
        duplicates={duplicates}
        isLoading={isLoading}
        error={isError}
        success={status === 'fulfilled'}
        idx={selectedIndex}
        onClose={onClose}
        onChange={onChange}
        handleUpdate={onUpdate}
        removeDuplicateByIndex={onSkip}
      >
        {(index: number) => (
          <UserDuplicateReview
            index={index}
            duplicates={duplicates}
            linkedRoles={currentRoles}
            newRoles={newRoles}
          />
        )}
      </DuplicateReviewModal>,
      document.getElementById('page-portal')!
    )
  )
}
