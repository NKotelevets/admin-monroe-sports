import styled from '@emotion/styled'

import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import EmailIllustration from '@/assets/images/onboarding/email-opened.svg'

const {
  Styles: { Title, Text, Subtitle, Body },
} = Layout

export const RequestSent = (props: { tryAgain: () => void }) => {
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
