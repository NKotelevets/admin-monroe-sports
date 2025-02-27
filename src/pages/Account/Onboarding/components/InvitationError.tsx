import styled from '@emotion/styled'
import { Layout } from '@/layouts/PublicLayout'
import ErrorIllustration from '@/assets/images/onboarding/oops.svg'

const {
  Styles: { Title, Subtitle, Body },
} = Layout


export const InvitationError = () => {
  return (
    <Body centered>
      <Illustration src={ErrorIllustration} />
      <Title>Something went wrong</Title>
      <Subtitle>Sorry there was some error, try again later.</Subtitle>
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
