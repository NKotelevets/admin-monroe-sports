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
  const { invite: _invite, callback } = props
  const { invitation: _invitation, userData, accepted, acceptInvitation, denyInvitation, isLoadingAccept, isLoadingDeny } = useInvitation()
  const { user: _user } = useUserSlice()

  const [invite, setInvite] = useState(_invite)
  const [user, setUser] = useState(_user)

  useEffect(() => {
    if (_invitation) {
      setInvite(transformKeysToCamelCase(_invitation))
    }
  }, [_invitation])

  useEffect(() => {
    if (userData) {
      setUser(transformKeysToCamelCase(userData))
    }
  }, [userData])

  /**
   * Accepts an invitation for the user and handles possible errors during the process.
   *
   * @function
   * @param {Object} user - The user object containing user details.
   * @param {Object} invite - The invitation object containing invitation details.
   * @returns {void}
   */
  useEffect(() => {
    if (!user || !invite || accepted === false) return

    acceptInvitation()
  }, [user, invite, accepted])

  useEffect(() => {
    if (!user || !invite || accepted === true || accepted === undefined) return

    denyInvitation()
  }, [user, invite, accepted, callback])

  const role = useMemo(() => {
    if (!invite) return ''

    if (invite.invite_type === INVITE_TYPE_NAMED.COACH) {
      return 'coach'
    }
    if (invite.invite_type === INVITE_TYPE_NAMED.HEAD_COACH) {
      return 'head coach'
    }
    if (invite.invite_type === INVITE_TYPE_NAMED.TEAM_ADMIN) {
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
        {user!.firstName} {user!.lastName} has been added as a coach for {invite.team!.name}.{' '}
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
