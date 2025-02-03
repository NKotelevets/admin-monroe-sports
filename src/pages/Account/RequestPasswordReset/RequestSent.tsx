import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import EmailIllustration from '@/assets/images/onboarding/email-opened.svg'

const {
  Styles: { Title, Text, Subtitle, Body },
} = Layout

/**
 * Displays a message indicating password recovery instructions were sent to the user's email.
 *
 * @param {Object} props - Component properties.
 * @param {function(): void} props.tryAgain - Callback function invoked when the user chooses to resend the email.
 * @returns {ReactElement} A UI component with instructions and an option to retry sending the email.
 */
export const RequestSent = (props: { tryAgain: () => void }): ReactElement => {
  const { tryAgain } = props

  return (
    <Body centered>
      <Illustration src={EmailIllustration} />
      <Title>Check Your Email</Title>
      <Subtitle small>We have sent a password recover instructions to your email</Subtitle>

      <FootNote>
        Did not receive the email? Check your spam filter, or try{' '}
        <Link to="#" underline onClick={tryAgain}>
          another email address
        </Link>
      </FootNote>
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
const FootNote = styled(Text)`
  width: 350px;
  position: absolute;
  bottom: 60px;
  @media (max-width: 360px) {
    width: 100%;
  }
`
