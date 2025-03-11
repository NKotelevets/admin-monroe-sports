import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useMemo } from 'react'

import Denied from '@/pages/Account/Invitations/components/InvitationDenied.tsx'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

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
  const { user, invitation } = useAccountSlice()
  const { loaded, invitationExpired } = useInvitation()

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

    return 'player'
  }, [invitation])

  if (!user || !invitation)
    if (!loaded || invitationExpired)
      return (
        <Page>
          <Body>
            {loaded && invitationExpired ? (
              <InvitationExpired />
            ) : (
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            )}
          </Body>
        </Page>
      )

  return (
    <Page>
      <Body>
        <Denied teamName={invitation?.team?.name || 'team'} role={invitationRole} />
      </Body>
    </Page>
  )
}

export default InvitationDenied
