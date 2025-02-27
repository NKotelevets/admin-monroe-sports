import styled from '@emotion/styled'
import { Layout } from '@/layouts/PublicLayout'
import ExpiredIllustration from '@/assets/images/onboarding/expired.svg'

const {
  Styles: { Title, Subtitle, Body },
} = Layout


export const InvitationExpired = () => {
  return (
    <Body centered>
      <Illustration src={ExpiredIllustration} />
      <Title>Invitation Expired</Title>
      <Subtitle>Please reach out to your team's coach or admin.</Subtitle>
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
