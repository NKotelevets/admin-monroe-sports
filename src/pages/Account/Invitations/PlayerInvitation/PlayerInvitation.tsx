import styled from '@emotion/styled'
import { Flex, notification } from 'antd'
import { ReactElement, useState } from 'react'

import { CreateSupervisedUserModal } from '@/pages/Account/Invitations/PlayerInvitation/CreateSupervisedUserModal.tsx'
import { UserCheckbox } from '@/pages/Account/Invitations/PlayerInvitation/UserCheckbox.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { IChildren } from '@/common/interfaces/user.ts'
import { TInviteProps } from '@/common/types/account.ts'
import { PlayerInvitationAccepted } from '@/pages/Account/Invitations/PlayerInvitation/PlayerInvitationAccepted.tsx'

const {
  Styles: { Title, Subtitle, Body, LargeButton },
} = Layout

/**
 * Represents the PlayerInvitation functional component.
 *
 * Renders an interface for accepting a team invitation. Allows the user to
 * select players for the invitation, including the user themselves or any
 * supervised users. Upon submission, the invite is processed, and the user
 * receives feedback on the success or failure of the action.
 *
 * @function PlayerInvitation
 * @param {TInviteProps} props - The properties required to render the invitation component.
 * @returns {ReactElement} The PlayerInvitation component or null if no user exists.
 */
export const PlayerInvitation = (props: TInviteProps): ReactElement => {
  const { invite } = props
  const { user } = useUserSlice()

  const [acceptInvite, { isLoading }] = useAcceptInviteMutation()
  const [api, contextHolder] = notification.useNotification()

  const [invitationAccepted, setInvitationAccepted] = useState(false)
  const [selectedAthletes, setSelectedAthletes] = useState([user!.id])
  const [createdSupervisedUsers, setCreatedSupervisedUsers] = useState<IChildren[] | null>(null)

  /**
   * Handles the selection and deselection of an athlete based on their ID.
   * Toggles the athlete's ID in the selectedAthletes list.
   *
   * @param {string} id - The ID of the athlete to be selected or deselected.
   * @returns {void}
   */
  const handleSelect = (id: string): void => {
    if (selectedAthletes.includes(id)) {
      setSelectedAthletes(selectedAthletes.filter((athleteId) => athleteId !== id))
    } else {
      setSelectedAthletes([...selectedAthletes, id])
    }
  }

  if (!user) return (
    <Body>
      Nothing to show here.
    </Body>
  )

  /**
   * Handles the submission of an invite acceptance.
   *
   * Submits the invitation acceptance request with the invite ID and selected
   * user IDs. On success, it sets the invitation as accepted. On failure, it
   * displays an error notification to the user.
   */
  const onSubmit = () => {
    acceptInvite({ invite_id: invite.id, users_ids: selectedAthletes })
      .unwrap()
      .then(() => {
        setInvitationAccepted(true)
      })
      .catch((error) => {
        api.error({
          message: `Could not accept invitation`,
          description: error?.details || error?.detail || 'Please, try again later.',
          placement: 'bottomRight',
        })
      })
  }

  if (invitationAccepted) {
    return <PlayerInvitationAccepted teamName={invite.team!.name} />
  }

  return (
    <Body centered>
      {contextHolder}
      <Title>Welcome to {invite.team!.name}</Title>
      <Subtitle small>Please submit the info for the player who is being added to {invite.team!.name}</Subtitle>

      <Wrap vertical>
        <UserCheckbox
          id={user.id}
          avatar={user.photoS3Url}
          selected={selectedAthletes.includes(user.id)}
          onSelect={handleSelect}
          name={`${user.firstName} ${user.lastName}`}
        />

        {[...(user.asParent?.filter((child) => child.firstName) || []), ...(createdSupervisedUsers || [])].map(
          (child) => (
            <UserCheckbox
              id={child.id}
              avatar={child.photoS3Url}
              selected={selectedAthletes.includes(child.id)}
              onSelect={handleSelect}
              name={`${child.firstName} ${child.lastName}`}
            />
          ),
        )}

        <CreateSupervisedUserModal setCreatedSupervisedUsers={setCreatedSupervisedUsers} />

        <LargeButton
          loading={isLoading}
          type="primary"
          onClick={onSubmit}
          disabled={!selectedAthletes.length || isLoading}
          style={{ marginTop: 20, marginBottom: 60 }}
        >
          Continue
        </LargeButton>
      </Wrap>
    </Body>
  )
}

// Styled Components
const Wrap = styled(Flex)`
  width: 80%;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`
