import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useMemo } from 'react'

import { ChildInvitation } from '@/pages/Account/Invitations/components/ChildInvitation/ChildInvitation.tsx'
import { FamilyInvitation } from '@/pages/Account/Invitations/components/FamilyInvitation/FamilyInvitation.tsx'
import { NoInvitations } from '@/pages/Account/Invitations/components/NoInvitations.tsx'
import { PlayerInvitation } from '@/pages/Account/Invitations/components/PlayerInvitation/PlayerInvitation.tsx'
import { StaffInvitation } from '@/pages/Account/Invitations/components/StaffInvitation/StaffInvitation.tsx'
import { ViewerInvitation } from '@/pages/Account/Invitations/components/ViewerInvitation.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useInvitation } from '@/hooks/useInvitation'

import { INVITE_TYPE_NAMED } from '@/common/constants'

const {
  Page,
  Styles: { Body },
} = Layout

const Invitation = () => {
  const { invitation: currentInvite, userData: user, acceptedString, loaded, accepted } = useInvitation()

  /**
   * Memoized variable that determines and returns the appropriate content
   * component based on the current user's role and the invite type.
   *
   * It evaluates conditions such as the presence of currentInvite, user data,
   * user type, and invite type to dynamically render a specific component or
   * fallback UI elements.
   *
   * Dependencies: currentInvite, user.
   *
   * @constant {React.Element} pageContent - The rendered content or component.
   */
  const pageContent = useMemo(() => {
    if (!loaded) return <Spin indicator={<LoadingOutlined spin />} size="large" />
    if (currentInvite === null || !user) return <NoInvitations />
    if (user.isChild && currentInvite.inviteType === INVITE_TYPE_NAMED.SUPERVISED)
      return <ChildInvitation />

    if (
      currentInvite.inviteType === INVITE_TYPE_NAMED.SUPERVISED ||
      currentInvite.inviteType === INVITE_TYPE_NAMED.SUPERVISOR
    )
      return <FamilyInvitation />

    if (
      currentInvite.inviteType === INVITE_TYPE_NAMED.COACH ||
      currentInvite.inviteType === INVITE_TYPE_NAMED.HEAD_COACH ||
      currentInvite.inviteType === INVITE_TYPE_NAMED.TEAM_ADMIN
    )
      return <StaffInvitation callback={() => undefined} accepted={accepted} />

    if (currentInvite.inviteType === INVITE_TYPE_NAMED.VIEWER) {
      return <ViewerInvitation />
    }

    return <PlayerInvitation callback={() => undefined} accepted={accepted} />
  }, [currentInvite, user, acceptedString])

  return (
    <Page centered={!(user?.isChild || currentInvite?.inviteType === INVITE_TYPE_NAMED.PLAYER)}>
      <Body>{pageContent}</Body>
    </Page>
  )
}

export default Invitation
