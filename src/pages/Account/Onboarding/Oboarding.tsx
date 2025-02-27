import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { InvitationError } from '@/pages/Account/Onboarding/components/InvitationError.tsx'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useLazyGetPrefilledDataQuery } from '@/redux/account/account.api.ts'

import { PATH_TO_ACCOUNT_CREATE_PASSWORD, PATH_TO_ACCOUNT_INVITATIONS } from '@/common/constants/paths.ts'
import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'

const {
  Page,
  Styles: { Body },
} = Layout

/**
 * The `Onboarding` component handles the invitation-based onboarding flow for users.
 * It retrieves prefilled user data and invitation details using a token, and navigates
 * users to the appropriate page based on their account status.
 *
 * The component:
 * - Fetches prefilled data using a token from URL parameters.
 * - Handles expired invitations or errors during data retrieval.
 * - Redirects to login or account creation based on user status.
 *
 * State Variables:
 * - `invitation`: Holds the invitation details.
 * - `invitationExpired`: Indicates whether the invitation is expired.
 * - `hasErrors`: Represents if an error occurred during data retrieval.
 * - `userData`: Stores user data fetched with the invitation details.
 *
 * Dependencies:
 * - React hooks: `useState`, `useEffect`
 * - React Router: `useNavigate`, `useParams`
 * - API hook: `useLazyGetPrefilledDataQuery`
 * - Navigation constants: `PATH_TO_ACCOUNT_INVITATIONS`, `PATH_TO_ACCOUNT_CREATE_PASSWORD`
 *
 * UI Components:
 * - Displays a loading spinner while data is being processed.
 * - Shows `InvitationExpired` or `InvitationError` components if applicable.
 */
const Onboarding = () => {
  const navigate = useNavigate()

  const { token, accepted: acceptedString } = useParams<{ token: string; accepted?: string }>()

  const [getPrefilledData] = useLazyGetPrefilledDataQuery()
  const [userData, setUserData] = useState<IFEUser | null>(null)
  const [invitation, setInvitation] = useState<IInvitation | null>(null)
  const [invitationExpired, setInvitationExpired] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)

  /**
   * Processes a token to fetch prefilled data and handle the response.
   * If the token is invalid or an error occurs, updates relevant states.
   * Updates user data and invitation if retrieved successfully.
   * Handles cases where the invitation is expired or errors occur during the process.
   */
  useEffect(() => {
    if (!token) return
    const payload = { token: token?.split('?')[0]?.split('&')[0] || '' }
    getPrefilledData(payload)
      .unwrap()
      .then((response) => {
        if (response?.invitation === undefined) {
          setInvitationExpired(true)
          return
        }
        setUserData(response.userData)
        setInvitation(response.invitation)
      })
      .catch(() => {
        setHasErrors(true)
      })
  }, [token])

  /**
   * Redirects the user based on their activation status and invitation token.
   *
   * If the user is active, navigates to the login page with the previous URL set to the invitation path.
   * If the user is inactive, navigates to the account creation password page with the token and acceptance string.
   *
   * Preconditions:
   * - `userData` and `invitation` must be defined.
   * - The `userData` object must contain an `is_active` property.
   *
   * @param {Object} userData - The user data object containing activation status.
   * @param {Object} invitation - The invitation data required for navigation.
   * @param {string} token - The invitation token used for navigation.
   * @param {string} acceptedString - Indicator of the invitation acceptance status.
   * @param {Function} navigate - Function for handling navigation between routes.
   */
  useEffect(() => {
    if (!userData || !invitation) return

    if (userData.isActive) {
      navigate(`/accounts/login?prev=${PATH_TO_ACCOUNT_INVITATIONS}/${token}/${acceptedString}`, { replace: true })
    } else {
      navigate(`${PATH_TO_ACCOUNT_CREATE_PASSWORD}/${token}/${acceptedString}`, { replace: true })
    }
  }, [userData, invitation])

  return (
    <Page centered>
      <Body>
        {!invitationExpired && <Spin indicator={<LoadingOutlined spin />} size="large" />}
        {invitationExpired && <InvitationExpired />}
        {hasErrors && !invitationExpired && <InvitationError />}
      </Body>
    </Page>
  )
}

export default Onboarding
