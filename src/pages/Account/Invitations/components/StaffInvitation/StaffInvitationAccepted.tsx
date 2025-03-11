import styled from '@emotion/styled'
import { ReactElement, useMemo } from 'react'

import { AppDownloadCTA } from '@/components/AppDownloadCTA.tsx'

import { Layout } from '@/layouts/PublicLayout'

import CoachIllustration from '@/assets/images/onboarding/coach-invitation.svg'
import { INVITE_TYPE_NAMED } from '@/common/constants'

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
export const StaffInvitationAccepted = (props: {name: string; teamName?: string; inviteType: number}): ReactElement => {
  const { name, teamName, inviteType } = props

  const role = useMemo(() => {

    if (inviteType === INVITE_TYPE_NAMED.COACH) {
      return 'coach'
    }
    if (inviteType === INVITE_TYPE_NAMED.HEAD_COACH) {
      return 'head coach'
    }
    if (inviteType === INVITE_TYPE_NAMED.TEAM_ADMIN) {
      return 'team admin'
    }
    return 'staff'
  }, [inviteType])

  return (
    <Body centered>
      <Illustration src={CoachIllustration} />
      <Title>Welcome to {teamName}</Title>
      <Subtitle small>
        {name} has been added as a {role} for {teamName}.{' '}
        <span className="capitalize">{role}</span> can submit their roster, invite players, enter availability, monitor
        RSVP and more.
      </Subtitle>
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
