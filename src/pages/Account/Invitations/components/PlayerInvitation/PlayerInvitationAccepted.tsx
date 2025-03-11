import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import PlayerIllustration from '@/assets/images/onboarding/player-invitation.svg'

const {
  Styles: { Title, Subtitle, Body },
} = Layout


/**
 * Displays a confirmation message when the player accepts an invitation to join a team.
 *
 * @param {!Object} props - The properties for the component.
 * @param {string} props.teamName - The name of the team the player has joined.
 * @return {ReactElement} A React component rendering the success message and additional information.
 */
export const PlayerInvitationAccepted = (props: {teamName?: string}): ReactElement => {
  const { teamName } = props

  return (
    <Body centered>
      <Illustration src={PlayerIllustration} />
      <Title>You have successfully joined {teamName ? `the ${teamName}` : 'Swift Schedule'}</Title>
      <Subtitle small>Get started now! Set your availability, explore your schedule, and stay on top of everything—right in the app.</Subtitle>
      <AppDownloadCTA />
    </Body>
  )
}

// Styled Components
const Illustration = styled.img`
  width: 135px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
