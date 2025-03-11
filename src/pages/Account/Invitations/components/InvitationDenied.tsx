import styled from '@emotion/styled'
import { Layout } from '@/layouts/PublicLayout'
import PlayerIllustration from '@/assets/images/onboarding/player-invitation.svg'
import { Link } from 'react-router-dom'

const {
  Styles: { Title, Subtitle, Body },
} = Layout

type TInvitationDeniedProps = {
  teamName: string,
  role?: string
}

const InvitationDenied = (props: TInvitationDeniedProps) => {
  const { teamName, role } = props
  return (
    <Body centered>
      <Illustration src={PlayerIllustration} />
      <Title>Invitation Rejected</Title>
      <Subtitle style={{marginBottom: 32}}>You have successfully rejected the invitation to join {teamName} {role ? `as ${role}` : ''}. If you change your mind and would like to join this team, please reach out to a Master Team Admin to request a new invitation.</Subtitle>
      <Subtitle>For further support, contact us at <Link to={'mailto:info@swiftschedule.net'}>info@swiftschedule.net</Link>.</Subtitle>
    </Body>
  )
}

export default InvitationDenied

// Styled Components
const Illustration = styled.img`
  width: 135px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    width: 94px !important;
  }
`
