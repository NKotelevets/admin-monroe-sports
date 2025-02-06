import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'
import PlayerIllustration from '@/assets/images/onboarding/player-invitation.svg'
import styled from '@emotion/styled'

const {
  Styles: { Title, Subtitle, Body },
} = Layout

export const NoInvitations = () => {
  return (
    <Body centered>
      <Illustration src={PlayerIllustration} />
      <Title>You have no invitations left!</Title>
      <Subtitle>Jump into the app to select your availability, view rosters & schedules and more.</Subtitle>
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
