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
  const phrase1 = ` to join ${teamName}${role ? ` as ${role}` : ''}`
  const phrase2 = teamName ? ' and would like to join this team' : ''
  const inviter = teamName ? 'to a Master Team Admin' : 'the inviter'

  return (
    <Body centered>
      <Illustration src={PlayerIllustration} />
      <Title>Invitation Rejected</Title>
      <Subtitle style={{marginBottom: 32}}>You have successfully rejected the invitation{phrase1}. If you change your mind{phrase2}, please reach out {inviter} to request a new invitation.</Subtitle>
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
