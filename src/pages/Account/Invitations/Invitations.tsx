import { LoadingOutlined } from '@ant-design/icons'
import { Spin, notification } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ChildInvitation } from '@/pages/Account/Invitations/components/ChildInvitation/ChildInvitation.tsx'
import { FamilyInvitation } from '@/pages/Account/Invitations/components/FamilyInvitation/FamilyInvitation.tsx'
import { NoInvitations } from '@/pages/Account/Invitations/components/NoInvitations.tsx'
import { PlayerInvitation } from '@/pages/Account/Invitations/components/PlayerInvitation/PlayerInvitation.tsx'
import { StaffInvitation } from '@/pages/Account/Invitations/components/StaffInvitation.tsx'

import { Layout } from '@/layouts/PublicLayout'

import {
  useLazyGetInviteByIdQuery,
  useLazyInviteListQuery
} from '@/redux/account/account.api.ts'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useLazyGetUserQuery } from '@/redux/user/user.api.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { IInvite } from '@/common/interfaces/user.ts'

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
  const { token, accepted: acceptedString } = useParams<{ token: string, accepted?: string }>()
  const { user } = useUserSlice()
  const { access } = useAuthSlice()

  const firstLoad = useRef(true)
  const [getLoggedUser] = useLazyGetUserQuery()
  const [getInvites] = useLazyInviteListQuery()
  const [getInviteByToken] = useLazyGetInviteByIdQuery()
  const [api, contextHolder] = notification.useNotification()

  const [, setInvites] = useState<IInvite[]>([])
  const [currentInvite, setCurrentInvite] = useState<undefined | null | IInvite>(undefined)

  const accepted = useMemo(() => {
    if (acceptedString === undefined) return undefined
    return acceptedString === 'true'
  }, [acceptedString])

  /**
   * Function to fetch an invitation details using a token.
   * Retrieves invitation data by passing a payload with an identifier, then sets the current invitation.
   * If fetching fails, displays an error notification with specific or generic error details.
   *
   * @param {{ id: string }} payload The payload containing an identifier for the invitation.
   */
  const getInvitationByToken = useCallback(
    (payload: { id: string }) => {
      if (!firstLoad?.current) return
      firstLoad.current = false

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
    },
    [firstLoad?.current],
  )

  /**
   * Fetches all invitations for a user and updates the current invite state.
   * If no invitations are found, sets the current invite to null.
   * Handles errors by showing a notification with relevant details.
   *
   * @function
   */
  const getAllInvitations = useCallback(() => {
    if (!user) return

    getInvites({ id: user.id || '' })
      .unwrap()
      .then((response) => {
        setInvites(response)
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
  }, [user])

  /**
   * Fetches invitation data based on the existence of a token.
   * If a token exists, retrieves a specific invitation by token.
   * Otherwise, retrieves all invitations.
   */
  useEffect(() => {
    if (token) {
      getInvitationByToken({ id: token?.split('?')[0]?.split('&')[0] || '' })
    }
    if (!token && user) {
      getAllInvitations()
    }
  }, [token, user])

  useEffect(() => {
    if (!user && access) {
      getLoggedUser()
    }
  }, [user, access])

  /**
   * Navigates to the next invitation in the list of invites. If the current
   * invitation is the last one or no invites exist, sets the current invitation
   * to null.
   *
   * @function
   */
  // const nextInvitation = () => {
  //   if (!invites.length) return setCurrentInvite(null)
  //   const nextIndex = invites.findIndex((invite) => invite.id === currentInvite?.id) + 1
  //   if (nextIndex <= invites.length) {
  //     setCurrentInvite(invites[nextIndex])
  //   } else {
  //     setCurrentInvite(null)
  //   }
  // }

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
    if (user.isChild && currentInvite.invite_type === INVITE_TYPE_NAMED.SUPERVISED)
      return <ChildInvitation invite={currentInvite} accepted={accepted} />

    if (
      currentInvite.invite_type === INVITE_TYPE_NAMED.SUPERVISED ||
      currentInvite.invite_type === INVITE_TYPE_NAMED.SUPERVISOR
    )
      return <FamilyInvitation invite={currentInvite} accepted={accepted} />

    if (
      currentInvite.invite_type === INVITE_TYPE_NAMED.COACH ||
      currentInvite.invite_type === INVITE_TYPE_NAMED.HEAD_COACH ||
      currentInvite.invite_type === INVITE_TYPE_NAMED.TEAM_ADMIN
    ) {
      return <StaffInvitation invite={currentInvite} accepted={accepted} />
    }

    return <PlayerInvitation invite={currentInvite} accepted={accepted} />
  }, [currentInvite, user, accepted])

  return (
    <Page centered={!(user?.isChild || currentInvite?.invite_type === INVITE_TYPE_NAMED.PLAYER)}>
      {contextHolder}
      <Body>{pageContent}</Body>
    </Page>
  )
}

export default Invitations
