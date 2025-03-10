import { LoadingOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Flex, Row, Spin, notification } from 'antd'
import { ReactElement, useEffect, useState } from 'react'

import { FamilyInvitationAccepted } from '@/pages/Account/Invitations/components/FamilyInvitation/FamilyInvitationAccepted.tsx'
import InvitationDenied from '@/pages/Account/Invitations/components/InvitationDenied.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useDenyInviteMutation } from '@/redux/account/account.api.ts'
import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

import FamilyIllustration from '@/assets/images/onboarding/family-invitation.svg'
import { TInviteProps } from '@/common/types/account.ts'
import { transformKeysToCamelCase } from '@/utils'
import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

const {
  Styles: { Title, Subtitle, Body, LargeButton },
} = Layout

/**
 * A React functional component that handles the display and interaction with family invitations.
 *
 * The component allows a user to accept or deny a family invitation based on its state and current user context.
 * It utilizes notification systems to handle errors during the acceptance or denial process.
 *
 * @function FamilyInvitation
 * @returns {ReactElement} A React element that renders the invitation details and interaction options.
 */
export const FamilyInvitation = (props: TInviteProps): ReactElement => {
  const { invite: _invite } = props
  const { invitation: _invitation, userData: user, accepted, loaded } = useInvitation()
  const { updatedUserData, tempPassword, childData } = useAccountSlice()

  const [api, contextHolder] = notification.useNotification()
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation()
  const [denyInvite, { isLoading: isLoadingDeny }] = useDenyInviteMutation()
  const [invitationStatus, setInvitationStatus] = useState<'accepted' | 'denied' | 'none'>('none')
  const [invite, setInvite] = useState(_invitation)

  useEffect(() => {
    if(_invite) {
      setInvite(transformKeysToCamelCase(_invite))
    }
  }, [_invite])

  /**
   * Handles the action of accepting an invitation.
   * Validates the presence of both user and invite before proceeding.
   * Accepts the invitation by making an API call with the relevant invite and user details.
   * Displays an error notification if the operation fails.
   */
  const onAcceptInvite = () => {
    if (!user || !invite) return

    acceptInvite({ invite_id: invite.id, users_ids: [user.id], password: tempPassword, ...updatedUserData, child_object: childData })
      .unwrap()
      .then(() => {
        setInvitationStatus('accepted')
      })
      .catch((error) => {
        api.error({
          message: `Could not accept invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }

  /**
   * Handles the denial of an invitation by invoking the `denyInvite` function and managing its promises.
   * Provides error handling through an API error notification if the operation fails.
   */
  const onDenyInvite = () => {
    if (!user || !invite) return

    denyInvite({ userId: user.id, inviteId: invite.id, usersIds: [user.id] })
      .unwrap()
      .then(() => {
        api.success({
          message: `Invitation denied`,
          description: 'You have successfully denied the invitation.',
          placement: 'bottomRight',
        })
        setInvitationStatus('denied')
      })
      .catch((error) => {
        api.error({
          message: `Could not deny invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }

  /**
   * Handles an invitation response based on the acceptance status.
   *
   * Executes `onAcceptInvite` if the invite is accepted,
   * otherwise executes `onDenyInvite`. Does nothing if
   * the acceptance status is undefined.
   *
   * @function
   */
  useEffect(() => {
    if (accepted === undefined) return

    if (accepted) {
      onAcceptInvite()
    } else {
      onDenyInvite()
    }
  }, [accepted])

  if (isLoading || !loaded || !invite || !user)
    return (
      <Body centered>
        {contextHolder}
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Body>
    )

  if (invitationStatus === 'accepted') {
    return (
      <FamilyInvitationAccepted
        familyName={invite.inviter?.lastName || user?.lastName || ''}
        userName={invite.children.map((child) => child.firstName).join(',') || ''}
      />
    )
  }

  if (invitationStatus === 'denied') {
    return <InvitationDenied teamName={invite.inviter?.lastName || user?.lastName || ''} role={'family'} />
  }

  return (
    <Body centered>
      {contextHolder}
      <Illustration src={FamilyIllustration} />
      <Title>Would you like to be added to {invite.inviter?.lastName || user?.lastName || ''} Family?</Title>
      <Subtitle small>
        Confirm that you are a member of this family. If you are not a part of the family, deny invite. Be careful, as
        your family members can access your information, set up your schedule, or set up RSVPs.
      </Subtitle>
      <>
        <ActionRow vertical gap={12}>
          <Row>
            <LargeButton
              onClick={onAcceptInvite}
              loading={isLoading}
              type="primary"
              htmlType="submit"
              disabled={isLoading}
            >
              Confirm invite
            </LargeButton>
          </Row>
          <Row>
            <LargeButton danger onClick={onDenyInvite} disabled={isLoadingDeny}>
              Deny invitation
            </LargeButton>
          </Row>
        </ActionRow>
      </>
    </Body>
  )
}

// Styled Components
const Illustration = styled.img`
  width: 170px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
const ActionRow = styled(Flex)`
  width: 70%;
  margin: 32px 0 40px;
`
