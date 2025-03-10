import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'

import { FamilyInvitationAccepted } from '@/pages/Account/Invitations/components/FamilyInvitation/FamilyInvitationAccepted.tsx'
import { PlayerInvitationAccepted } from '@/pages/Account/Invitations/components/PlayerInvitation/PlayerInvitationAccepted.tsx'
import { StaffInvitation } from '@/pages/Account/Invitations/components/StaffInvitation.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { useInvitation } from '@/hooks/useInvitation.ts'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

const {
  Page,
  Styles: { Body },
} = Layout

const AcceptedInvitation = () => {
  const { user, invitation } = useAccountSlice()
  const { loaded, invitationExpired} = useInvitation()
  const [type, setType] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (invitation) {
      setType(invitation.inviteType)
    }
  }, [invitation])

  if (!user || !invitation || !type || invitationExpired)
    return (
      <Page>
        <Body>
          {loaded && invitationExpired ? <InvitationExpired /> : <Spin indicator={<LoadingOutlined spin />} size="large" />}
        </Body>
      </Page>
    )

  const content = () => {
    // Family invitation
    if (type === INVITE_TYPE_NAMED.SUPERVISED || type === INVITE_TYPE_NAMED.SUPERVISOR) {
      return (
        <FamilyInvitationAccepted
          familyName={invitation?.inviter?.lastName || 'family'}
          userName={`${user.firstName} ${user.lastName}`}
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
        <Page>
          <StaffInvitation />
        </Page>
      )
    }

    // Invite without role
    if (type === INVITE_TYPE_NAMED.VIEWER) {
      return <PlayerInvitationAccepted teamName={'team'} />
    }

    return <PlayerInvitationAccepted teamName={invitation?.team?.name || 'team'} />
  }

  return <Page>{content()}</Page>
}

export default AcceptedInvitation
