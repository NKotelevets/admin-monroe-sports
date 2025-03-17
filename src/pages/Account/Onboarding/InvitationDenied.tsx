import { useMemo } from 'react'

import Denied from '@/pages/Account/Invitations/components/InvitationDenied.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'

const {
  Page,
  Styles: { Body },
} = Layout

/**
 * A React component that displays a message for a denied invitation to join a team.
 *
 * The component uses invitation and user data to determine the appropriate role and messages
 * to display. Handles scenarios where the invitation has expired or the invitation/user data
 * has not fully loaded.
 *
 * @function
 * @name InvitationDenied
 * @returns {JSX.Element} The rendered component for an invitation denial message.
 */
const InvitationDenied = () => {
  const { invitation } = useAccountSlice()

  const invitationRole = useMemo(() => {
    if (invitation?.inviteType === INVITE_TYPE_NAMED.COACH) {
      return 'coach'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.HEAD_COACH) {
      return 'head coach'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.TEAM_ADMIN) {
      return 'team admin'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.MASTER_ADMIN) {
      return 'master admin'
    }

    return undefined
  }, [invitation])

  return (
    <Page>
      <Body>
        <Denied teamName={invitation?.team?.name || 'the team'} role={invitationRole} />
      </Body>
    </Page>
  )
}

export default InvitationDenied
