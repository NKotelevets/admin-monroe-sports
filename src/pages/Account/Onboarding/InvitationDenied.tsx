import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useMemo } from 'react'

import Denied from '@/pages/Account/Invitations/components/InvitationDenied.tsx'
import { InvitationError } from '@/pages/Account/Onboarding/components/InvitationError.tsx'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'

const {
  Page,
  Styles: { Body },
} = Layout

const InvitationDenied = () => {
  const { user, invitation } = useAccountSlice()
  const { loaded, invitationExpired, hasErrors } = useInvitation()

  const invitationRole = useMemo(() => {
    if (invitation?.inviteType === INVITE_TYPE_NAMED.COACH) {
      return 'coach'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.HEAD_COACH) {
      return 'head coach'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.TEAM_ADMIN) {
      return 'Team admin'
    }
    if (invitation?.inviteType === INVITE_TYPE_NAMED.MASTER_ADMIN) {
      return 'master admin'
    }

    return 'player'
  }, [invitation])

  if (hasErrors) {
    return (
      <Page>
        <Body>
          <InvitationError />
        </Body>
      </Page>
    )
  }

  if (!user || !invitation || invitationExpired)
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
        <Denied teamName={invitation.team?.name || 'team'} role={invitationRole} />
      </Body>
    </Page>
  )
}

export default InvitationDenied
