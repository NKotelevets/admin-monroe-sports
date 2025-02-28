import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useLazyGetPrefilledDataQuery } from '@/redux/account/account.api.ts'

import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'

type TUseInvitation = {
  userData: IFEUser | null
  invitation: IInvitation | null
  invitationExpired: boolean
  hasErrors: boolean
  acceptedString: string | undefined
  token: string | undefined
}

/**
 * Custom hook for managing invitation-related state and logic.
 *
 * Retrieves and processes prefilled data based on a token.
 * Manages the state of user data, invitation information, and errors related to the invitation.
 * Determines whether the invitation has expired or if other errors occurred.
 *
 * @return {{
 *   userData: (IFEUser|null),
 *   invitation: (IInvitation|null),
 *   invitationExpired: boolean,
 *   hasErrors: boolean,
 *   acceptedString: (string|undefined)
 * }} An object containing the user data, invitation information, invitation expiration status, error status, and acceptance status string.
 */
export const useInvitation = (): TUseInvitation => {
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

  return {
    acceptedString,
    token,
    userData,
    invitation,
    invitationExpired,
    hasErrors,
  }
}
