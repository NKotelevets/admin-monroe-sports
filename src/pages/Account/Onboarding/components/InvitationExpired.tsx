import styled from '@emotion/styled'

import { Layout } from '@/layouts/PublicLayout'

import ExpiredIllustration from '@/assets/images/onboarding/expired.svg'

const {
  Page,
  Styles: { Title, Subtitle, Body },
} = Layout

export const InvitationExpired = ({ page }: { page?: boolean }) => {

  const content = () => (
    <Body centered>
      <Illustration src={ExpiredIllustration} />
      <Title>Invitation Expired</Title>
      <Subtitle>Please reach out to your team's coach or admin.</Subtitle>
    </Body>
  )

  if (page) {
    return (
      <Page centered>
        {content()}
      </Page>
    )
  }

  return content()
}

// Styled Components
const Illustration = styled.img`
  width: 135px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
