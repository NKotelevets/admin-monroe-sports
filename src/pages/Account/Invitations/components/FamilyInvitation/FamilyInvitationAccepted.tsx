import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import FamilyIllustration from '@/assets/images/onboarding/family-invitation.svg'

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
export const FamilyInvitationAccepted = (props: {familyName: string, userName: string}): ReactElement => {
  const { familyName, userName } = props

  return (
    <Body centered>
      <Illustration src={FamilyIllustration} />
      <Title>Welcome to {familyName} Family</Title>
      <Subtitle small>{userName} has been added as a child for {familyName} family. Your parent/guardian can submit your roster, enter availability, monitor RSVP and more.</Subtitle>
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
