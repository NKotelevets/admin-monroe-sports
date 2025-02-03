import { LoadingOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Spin, notification } from 'antd'
import { ReactElement, useEffect } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

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
  const { invite } = props
  const { user } = useUserSlice()

  const [api, contextHolder] = notification.useNotification()
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation()

  /**
   * Accepts an invitation for the user and handles possible errors during the process.
   *
   * @function
   * @param {Object} user - The user object containing user details.
   * @param {Object} invite - The invitation object containing invitation details.
   * @returns {void}
   */
  useEffect(() => {
    if (!user || !invite) return

    acceptInvite({ invite_id: invite.id, users_ids: [user.id] })
      .unwrap()
      .then(() => {})
      .catch((error) => {
        api.error({
          message: `Could not accept invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }, [user, invite])

  if (isLoading)
    return (
      <Body centered>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Body>
    )

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
