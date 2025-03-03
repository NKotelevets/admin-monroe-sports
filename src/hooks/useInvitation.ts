import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useLazyGetPrefilledDataQuery } from '@/redux/account/account.api.ts'

import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'
import { useAppDispatch } from '@/redux/hooks.ts'
import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'
import { receiveInvitationThunk } from '@/redux/account/account.slice.tsx'
import {
  PATH_TO_ACCOUNT_INVITATIONS, PATH_TO_ACCOUNT_INVITE_PARENT,
  PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA, PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PARENT_DATA,
  PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD
} from '@/common/constants/paths.ts'
import dayjs from 'dayjs'

type TUseInvitation = {
  userData: IFEUser | null
  invitation: IInvitation | null
  invitationExpired: boolean
  hasErrors: boolean
  acceptedString: string | undefined
  token: string | undefined
  loaded: boolean
  nextStep(): void
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
  const navigate = useNavigate()
  const location = useLocation()
  const hasDispatched = useRef(false)
  const dispatch = useAppDispatch()

  const { status, setError, setExpired, setConfirmData, setUnder16, setPending} = useAccountSlice()
  const { token, accepted: acceptedString } = useParams<{ token: string; accepted?: string }>()

  const [getPrefilledData] = useLazyGetPrefilledDataQuery()
  const [userData, setUserData] = useState<IFEUser | null>(null)
  const [invitation, setInvitation] = useState<IInvitation | null>(null)
  const [invitationExpired, setInvitationExpired] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [loaded, setLoaded] = useState(false)

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
      .finally(() => {
        setLoaded(true)
      })
  }, [token])

  useEffect(() => {
    _nextStep()
  }, [loaded])

  const nextStep = () => {
    if (status === 'createPassword') {
      setConfirmData()
      _nextStep()
    } else if (status === 'confirmData') {
      if (dayjs().diff(dayjs(userData?.birthDate, 'YYYY-MM-DD'), 'years') < 16) {
        setUnder16()
        _nextStep()
      } else {
        setPending()
        _nextStep()
      }
    } else if (status === 'confirmParentData') {
      setPending()
      _nextStep()
    } else if (status === 'under16') {
      setPending()
      _nextStep()
    }
  }

  const _nextStep = () => {
    if (!loaded) return
    if (hasErrors) setError()
    if (invitationExpired) setExpired()

    // ✅ Only dispatch once per render cycle
    if (!hasDispatched.current && !hasErrors && !invitationExpired) {
      hasDispatched.current = true
      dispatch(
        receiveInvitationThunk({
          userData: userData || undefined,
          invitation: invitation || undefined,
          token: token || undefined,
        }),
      )
    }

    let newPath = null

    if (status === 'createPassword' && !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD)) {
      newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD}/${token}/${acceptedString}`
    } else if (status === 'confirmData' && !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA)) {
      newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA}/${token}/${acceptedString}`
    } else if (
      status === 'confirmParentData' &&
      !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PARENT_DATA)
    ) {
      newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PARENT_DATA}/${token}/${acceptedString}`
    } else if (
      (status === 'pending' || status === 'requestLogin') &&
      !location.pathname.includes(PATH_TO_ACCOUNT_INVITATIONS)
    ) {
      newPath = `/accounts/login?prev=${PATH_TO_ACCOUNT_INVITATIONS}/${token}/${acceptedString}`
    } else if (status === 'under16' && !location.pathname.includes(PATH_TO_ACCOUNT_INVITE_PARENT)) {
      newPath = `${PATH_TO_ACCOUNT_INVITE_PARENT}/${token}/${acceptedString}`
    }

    if (newPath) {
      navigate(newPath, { replace: true })
    }
  }

  return {
    acceptedString,
    token,
    userData,
    invitation,
    invitationExpired,
    hasErrors,
    nextStep,
    loaded
  }
}
