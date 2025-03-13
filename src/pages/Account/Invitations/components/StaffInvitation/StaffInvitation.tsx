import { LoadingOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Spin } from 'antd'
import { ReactElement, useEffect, useMemo, useState } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

import { transformKeysToCamelCase } from '@/utils'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { TInviteProps } from '@/common/types/account.ts'

import CoachIllustration from '@/assets/images/onboarding/coach-invitation.svg'

const {
  Styles: { Title, Subtitle, Body },
} = Layout

/**
 * StaffInvitation component processes and displays an invitation
 * for a user to join a team as a staff member.
 *
 * @function
 * @param {TInviteProps} props - Contains the invitation data and properties.
 * @returns {ReactElement} The rendered component.
 *
 * This component handles accepting the staff invitation using an API call,
 * provides user feedback through notifications, and displays relevant
 * information about the invitation status and team details.
 */
export const StaffInvitation = (props: TInviteProps): ReactElement => {
  const { invite: _invite, autoAccept } = props
  const {
    invitation: _invitation,
    userData: _userData,
    accepted,
    acceptInvitation,
    denyInvitation,
    isLoadingAccept,
    isLoadingDeny,
  } = useInvitation()

  const { user: _user } = useUserSlice()

  const [user, setUser] = useState(_user)
  const [invite, setInvite] = useState(_invite)

  useEffect(() => {
    if(_invitation) {
      setInvite(transformKeysToCamelCase(_invitation))
    }
  }, [_invitation])

  useEffect(() => {
    if(_userData) {
      setUser(transformKeysToCamelCase(_userData))
    }
  }, [_userData])

  useEffect(() => {
    if (_user) {
      setUser(_user)
    }
  }, [_user])

  /**
   * Handles the submission logic based on the state of the `accepted` variable.
   * If `accepted` is undefined, the function exits early.
   * If `accepted` is true, the `onSubmit` function is called.
   */
  useEffect(() => {
    if (accepted === undefined || autoAccept === false) return

    if (accepted) {
      acceptInvitation()
    } else {
      denyInvitation()
    }
  }, [accepted])

  const role = useMemo(() => {
    if (!invite) return ''

    if (invite.inviteType === INVITE_TYPE_NAMED.COACH) {
      return 'coach'
    }
    if (invite.inviteType === INVITE_TYPE_NAMED.HEAD_COACH) {
      return 'head coach'
    }
    if (invite.inviteType === INVITE_TYPE_NAMED.TEAM_ADMIN) {
      return 'team admin'
    }
    return ''
  }, [invite])

  if (isLoadingAccept || isLoadingDeny || !invite)
    return (
      <Body centered>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Body>
    )

  return (
    <Body centered>
      <Illustration src={CoachIllustration} />
      <Title>Welcome to {invite.team!.name}</Title>
      <Subtitle small>
        {user!.firstName} {user!.lastName} has been added as a {role} for {invite.team!.name}.{' '}
        <span className="capitalize">{role}</span> can submit their roster, invite players, enter availability, monitor
        RSVP and more.
      </Subtitle>
      <AppDownloadCTA />
    </Body>
  )
}

// Styled Components
const Illustration = styled.img`
  width: 231px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
