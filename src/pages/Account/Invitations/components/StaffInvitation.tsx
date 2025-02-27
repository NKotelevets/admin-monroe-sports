import { LoadingOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Spin, notification } from 'antd'
import { ReactElement, useEffect, useState } from 'react'

import InvitationDenied from '@/pages/Account/Invitations/components/InvitationDenied.tsx'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useDenyInviteMutation } from '@/redux/account/account.api.ts'
import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

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
  const { invite, accepted, callback } = props
  const { user } = useUserSlice()

  const [api, contextHolder] = notification.useNotification()
  const [denyInvite, { isLoading: isLoadingDeny }] = useDenyInviteMutation()
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation()
  const [invitationDenied, setInvitationDenied] = useState(false)

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

    acceptInvite({ invite_id: invite.id, users_ids: [user.id] })
      .unwrap()
      .then(() => {
        api.success({
          message: `Invitation accepted`,
          description: 'You have successfully accepted the invitation.',
          placement: 'bottomRight',
        })
        setTimeout(() => {
          callback && callback()
        }, 2000)
      })
      .catch((error) => {
        api.error({
          message: `Could not accept invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }, [user, invite, accepted])

  useEffect(() => {
    if (!user || !invite || accepted === true || accepted === undefined) return

    denyInvite({ userId: user.id, inviteId: invite.id, usersIds: [user.id] })
      .unwrap()
      .then(() => {
        api.success({
          message: `Invitation denied`,
          description: 'You have successfully denied the invitation.',
          placement: 'bottomRight',
        })
        setInvitationDenied(true)
      })
      .catch((error) => {
        api.error({
          message: `Could not deny invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }, [user, invite, accepted, callback])

  if (isLoading || isLoadingDeny)
    return (
      <Body centered>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Body>
    )

  if (invitationDenied) {
    return <InvitationDenied teamName={invite.team!.name} role={'coach'} />
  }

  return (
    <Body centered>
      {contextHolder}
      <Illustration src={CoachIllustration} />
      <Title>Welcome to {invite.team!.name}</Title>
      <Subtitle small>
        {user!.firstName} {user!.lastName} has been added as a coach for {invite.team!.name}. Coaches can submit their
        roster, invite players, enter availability, monitor RSVP and more.
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
