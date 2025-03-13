import { ReactElement, useEffect, useState } from 'react'

import { FamilyInvitationAccepted } from '@/pages/Account/Invitations/components/FamilyInvitation/FamilyInvitationAccepted.tsx'
import { PlayerInvitationAccepted } from '@/pages/Account/Invitations/components/PlayerInvitation/PlayerInvitationAccepted.tsx'
import { StaffInvitationAccepted } from '@/pages/Account/Invitations/components/StaffInvitation/StaffInvitationAccepted.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'

const { Page } = Layout

/**
 * Component handling the display logic of an accepted invitation.
 * Renders appropriate content based on the user, invitation details,
 * and type of invitation, such as family, staff, or viewer role invitations.
 * Displays a loading spinner or an expired invitation message when appropriate conditions are met.
 *
 * @function
 * @returns {ReactElement | null} Returns the component to display the relevant content
 * based on the invitation type, or null if necessary conditions are not satisfied.
 */
const AcceptedInvitation = (): ReactElement => {
  const { invitation } = useAccountSlice()
  const { user } = useUserSlice()
  const [type, setType] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (invitation) {
      setType(invitation.inviteType)
    }
  }, [invitation])

  const content = () => {
    // Family invitation
    if (type === INVITE_TYPE_NAMED.SUPERVISED || type === INVITE_TYPE_NAMED.SUPERVISOR) {
      return (
        <FamilyInvitationAccepted
          familyName={invitation?.inviter?.lastName || 'family'}
          userName={user ? `${user.firstName} ${user.lastName}` : 'The user'}
        />
      )
    }

    // Staff invitation
    if (
      type === INVITE_TYPE_NAMED.COACH ||
      type === INVITE_TYPE_NAMED.HEAD_COACH ||
      type === INVITE_TYPE_NAMED.TEAM_ADMIN
    ) {
      return (
        <StaffInvitationAccepted
          name={user ? `${user.firstName} ${user.lastName}` : 'The user'}
          teamName={invitation?.team?.name || 'Swift Schedule'}
          inviteType={type}
        />
      )
    }

    // Invite without role
    if (type === INVITE_TYPE_NAMED.VIEWER) {
      return <PlayerInvitationAccepted />
    }

    return <PlayerInvitationAccepted teamName={invitation?.team?.name || 'team'} />
  }

  return <Page centered>{content()}</Page>
}

export default AcceptedInvitation
