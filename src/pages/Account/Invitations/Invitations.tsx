import { LoadingOutlined } from '@ant-design/icons'
import { Spin, notification } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ChildInvitation } from '@/pages/Account/Invitations/ChildInvitation/ChildInvitation.tsx'
import { NoInvitations } from '@/pages/Account/Invitations/NoInvitations.tsx'
import { PlayerInvitation } from '@/pages/Account/Invitations/PlayerInvitation/PlayerInvitation.tsx'
import { StaffInvitation } from '@/pages/Account/Invitations/StaffInvitation.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useLazyGetInviteByIdQuery, useLazyInviteListQuery } from '@/redux/account/account.api.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { IInvite } from '@/common/interfaces/user.ts'
import { FamilyInvitation } from '@/pages/Account/Invitations/FamilyInvitation/FamilyInvitation.tsx'

const {
  Page,
  Styles: { Body },
} = Layout

/**
 * A React functional component handling the logic for displaying user invitations.
 * Dynamically fetches and renders invitation details or lists based on URL parameters and user context.
 *
 * Facilitates retrieving individual invitations by token or all invitations related to the logged-in user.
 * Displays different content components depending on the invitation type and user role.
 *
 * State and Effects:
 * - Tracks and sets the current invitation for rendering (currentInvite).
 * - Executes side effects to fetch invitations based on token presence in the URL.
 *
 * Key Features:
 * - Error handling through notifications for failed API calls.
 * - Dynamically determines the page content based on user role and invite type.
 *
 * Dependencies:
 * - Hooks: useParams, useUserSlice, useLazyInviteListQuery, useLazyGetInviteByIdQuery, useState, useEffect, useMemo.
 * - Components: Page, Body, Spin, LoadingOutlined, ChildInvitation, StaffInvitation, PlayerInvitation.
 */
const Invitations = () => {
  const { token } = useParams<{ token: string }>()
  const { user } = useUserSlice()

  const [getInvites] = useLazyInviteListQuery()
  const [getInviteByToken] = useLazyGetInviteByIdQuery()
  const [currentInvite, setCurrentInvite] = useState<undefined | null | IInvite>(undefined)
  const [api, contextHolder] = notification.useNotification()

  /**
   * Function to fetch an invitation details using a token.
   * Retrieves invitation data by passing a payload with an identifier, then sets the current invitation.
   * If fetching fails, displays an error notification with specific or generic error details.
   *
   * @param {{ id: string }} payload The payload containing an identifier for the invitation.
   */
  const getInvitationByToken = (payload: { id: string }) => {
    getInviteByToken(payload)
      .unwrap()
      .then((response) => {
        response ? setCurrentInvite(response) : setCurrentInvite(null)
      })
      .catch((error) => {
        api.error({
          message: 'Could not load invitation',
          description:
            error?.details || error?.detail || 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }

  /**
   * Fetches all invitations for a user and updates the current invite state.
   * If no invitations are found, sets the current invite to null.
   * Handles errors by showing a notification with relevant details.
   *
   * @function
   */
  const getAllInvitations = () => {
    getInvites({ id: user?.id || '' })
      .unwrap()
      .then((response) => {
        response.length ? setCurrentInvite(response[0]) : setCurrentInvite(null)
      })
      .catch((error) => {
        api.error({
          message: 'Could not load invitations',
          description:
            error?.details || error?.detail || 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }

  /**
   * Fetches invitation data based on the existence of a token.
   * If a token exists, retrieves a specific invitation by token.
   * Otherwise, retrieves all invitations.
   */
  useEffect(() => {
    if (token) {
      getInvitationByToken({ id: token })
    } else {
      getAllInvitations()
    }
  }, [token])

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
    if (currentInvite === null) return <NoInvitations />
    if (currentInvite === undefined || !user) return <Spin indicator={<LoadingOutlined spin />} size="large" />
    if (user.isChild && currentInvite.invite_type !== INVITE_TYPE_NAMED.SUPERVISED)
      return <ChildInvitation invite={currentInvite} />

    if (
      currentInvite.invite_type !== INVITE_TYPE_NAMED.SUPERVISED ||
      currentInvite.invite_type !== INVITE_TYPE_NAMED.SUPERVISED
    )
      return <FamilyInvitation invite={currentInvite} />

    if (
      currentInvite.invite_type === INVITE_TYPE_NAMED.COACH ||
      currentInvite.invite_type === INVITE_TYPE_NAMED.HEAD_COACH ||
      currentInvite.invite_type === INVITE_TYPE_NAMED.TEAM_ADMIN
    )
      return <StaffInvitation invite={currentInvite} />

    return <PlayerInvitation invite={currentInvite} />
  }, [currentInvite, user])

  return (
    <Page centered={!(user?.isChild || currentInvite?.invite_type === INVITE_TYPE_NAMED.PLAYER)}>
      {contextHolder}
      <Body>{pageContent}</Body>
    </Page>
  )
}

export default Invitations
