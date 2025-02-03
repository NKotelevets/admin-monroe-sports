import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import EmailIllustration from '@/assets/images/onboarding/email-opened.svg'

const {
  Styles: { Title, Subtitle, Body },
} = Layout

/**
 * Displays a confirmation message indicating that a parent/guardian will receive an invitation.
 * Provides options for the user to open the app or download it from app stores, with responsive behavior for mobile and non-mobile views.
 *
 * @function
 * @name ParenInviteSent
 * @returns {ReactElement}
 */
export const ParenInviteSent = (): ReactElement => {
  return (
    <Body centered>
      <Illustration src={EmailIllustration} />
      <Title>Your parent/guardian will receive an invitation</Title>
      <Subtitle small>In the meantime, go to the app so you don't lose touch with us.</Subtitle>
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
