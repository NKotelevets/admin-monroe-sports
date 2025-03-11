import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useDenyInviteMutation, useLazyGetPrefilledDataQuery } from '@/redux/account/account.api.ts'
import { receiveInvitationThunk } from '@/redux/account/account.slice.tsx'
import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'
import { useAppDispatch } from '@/redux/hooks.ts'
import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'

import {
  PATH_TO_ACCOUNT_INVITATIONS,
  PATH_TO_ACCOUNT_INVITATION_ACCEPTED,
  PATH_TO_ACCOUNT_INVITATION_DENIED,
  PATH_TO_ACCOUNT_INVITATION_EXPIRED,
  PATH_TO_ACCOUNT_INVITE_PARENT,
  PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA,
  PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PLAYER_DATA,
  PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD,
  PATH_TO_ACCOUNT_ONBOARDING_INVITATION,
  PATH_TO_ACCOUNT_ONBOARDING_SIGNUP,
} from '@/common/constants/paths.ts'
import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'

type TUseInvitation = {
  userData: IFEUser | null
  invitation: IInvitation | null
  invitationExpired: boolean
  hasErrors: boolean
  acceptedString: string | undefined
  accepted: boolean | undefined
  token: string | undefined
  loaded: boolean
  isLoadingDeny: boolean
  isLoadingAccept: boolean
  errorMessage: string | null
  nextStep(): void
  navigateToCurrentStep(): void
  acceptInvitation(selectedChildrenId?: string[]): void
  denyInvitation(selectedChildrenId?: string[]): void
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
  const {
    status,
    setError,
    setExpired,
    setAccepted: setStatusAccepted,
    setDenied,
    setConfirmData,
    tempPassword,
    setCreatePassword,
    setPending,
    setSignUp,
    updatedUserData,
    childData,
  } = useAccountSlice()
  const { access } = useAuthSlice()
  const { token, accepted: acceptedString } = useParams<{ token: string; accepted?: string }>()

  const navigate = useNavigate()
  const location = useLocation()
  const hasDispatched = useRef(false)
  const dispatch = useAppDispatch()

  const [getPrefilledData] = useLazyGetPrefilledDataQuery()
  const [acceptInvite, { isLoading: isLoadingAccept }] = useAcceptInviteMutation()
  const [denyInvite, { isLoading: isLoadingDeny }] = useDenyInviteMutation()

  const [userData, setUserData] = useState<IFEUser | null>(null)
  const [invitation, setInvitation] = useState<IInvitation | null>(null)
  const [invitationExpired, setInvitationExpired] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [accepted, setAccepted] = useState<boolean | undefined>(undefined)

  /**
   * Processes a token to fetch prefilled data and handle the response.
   * If the token is invalid or an error occurs, updates relevant states.
   * Updates user data and invitation if retrieved successfully.
   * Handles cases where the invitation is expired or errors occur during the process.
   */
  useEffect(() => {
    if (!token || (userData && invitation)) return
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
      .catch((reason) => {
        if (reason.status === 404) {
          setSignUp({ callback: navigateToCurrentStep, params: false })
          return
        }

        if (reason.status === 400) {
          setHasErrors(true)
          setInvitationExpired(true)
          return
        }
      })
      .finally(() => {
        setLoaded(true)
      })
  }, [token, userData, invitation])

  useEffect(() => {
    if (acceptedString) {
      const _accepted = acceptedString?.split('?')[0]?.split('&')[0]
      setAccepted(_accepted === 'undefined' || _accepted === undefined ? undefined : _accepted === 'true')
    }
  }, [acceptedString])

  const nextStep = () => {
    if (status === 'createPassword') {
      setConfirmData({ callback: navigateToCurrentStep, params: false })
    } else if (status === 'confirmData') {
      setPending({ callback: navigateToCurrentStep, params: false })
    } else if (status === 'confirmParentData') {
      setPending({ callback: navigateToCurrentStep, params: false })
    } else if (status === 'under16') {
      setCreatePassword({ callback: navigateToCurrentStep, params: false })
    }
  }

  useEffect(() => {
    navigateToCurrentStep(false)
  }, [status])

  const navigateToCurrentStep = useCallback(
    (shouldDispatch = true) => {
      if (!loaded) return
      if (hasErrors) setError()
      if (invitationExpired) setExpired()

      // ✅ Only dispatch once per render cycle
      if ((shouldDispatch && !hasDispatched.current && !hasErrors && !invitationExpired) || status === 'idle') {
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
      const invitationsPath = access ? PATH_TO_ACCOUNT_INVITATIONS : PATH_TO_ACCOUNT_ONBOARDING_INVITATION

      if (status === 'createPassword' && !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD)) {
        newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD}/${token}/${acceptedString}`
      } else if (status === 'confirmData' && !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA)) {
        newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA}/${token}/${acceptedString}`
      } else if (
        status === 'confirmParentData' &&
        !location.pathname.includes(PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PLAYER_DATA)
      ) {
        newPath = `${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PLAYER_DATA}/${token}/${acceptedString}`
      } else if ((status === 'pending' || status === 'requestLogin') && !invitationsPath) {
        newPath = `${invitationsPath}/${token}/${acceptedString}`
      } else if (status === 'under16' && !location.pathname.includes(PATH_TO_ACCOUNT_INVITE_PARENT)) {
        newPath = `${PATH_TO_ACCOUNT_INVITE_PARENT}/${token}/${acceptedString}`
      } else if (status === 'signUp') {
        newPath = `${PATH_TO_ACCOUNT_ONBOARDING_SIGNUP}/${token}/${acceptedString}`
      } else if (status === 'expired') {
        newPath = `${PATH_TO_ACCOUNT_INVITATION_EXPIRED}/${token}/${acceptedString}`
      } else if (status === 'accepted' && !location.pathname.includes(PATH_TO_ACCOUNT_INVITATION_ACCEPTED)) {
        newPath = `${PATH_TO_ACCOUNT_INVITATION_ACCEPTED}/${token}/${acceptedString}`
      } else if (status === 'rejected' && !location.pathname.includes(PATH_TO_ACCOUNT_INVITATION_DENIED)) {
        newPath = `${PATH_TO_ACCOUNT_INVITATION_DENIED}/${token}/${acceptedString}`
      }

      if (newPath) {
        navigate(newPath, { replace: true })
      }
    },
    [status, loaded, hasErrors, invitationExpired, hasDispatched?.current, location.pathname],
  )

  const acceptInvitation = (selectedAthletes?: string[]) => {
    const payload = {
      invite_id: invitation?.id || '',
      users_ids: selectedAthletes,
      password: tempPassword,
      ...updatedUserData,
      child_object: childData,
    }

    acceptInvite(payload)
      .unwrap()
      .then(() => {
        setStatusAccepted()
      })
      .catch((error) => {
        setHasErrors(true)
        setHasErrors(true)
        const message = typeof error.data === 'string' ? error.data : 'Something went wrong. Please try again later.'
        setErrorMessage(error?.data?.detail || error?.data?.details || error?.data?.message || message)
      })
  }

  const denyInvitation = (selectedAthletes?: string[]) => {
    const { gender, ...rest } = updatedUserData || { gender: undefined }
    denyInvite({
      userId: userData?.id || '',
      inviteId: invitation?.id || '',
      usersIds: selectedAthletes,
      ...rest,
      ...(gender ? { gender: `${gender}` } : {}),
      childObject: childData,
    })
      .unwrap()
      .then(() => {
        setDenied()
      })
      .catch((error) => {
        setHasErrors(true)
        const message = typeof error === 'string' ? error : 'Something went wrong. Please try again later.'
        setErrorMessage(error?.detail || error?.details || error?.message || message)
      })
  }

  return {
    acceptedString,
    accepted,
    token,
    userData,
    invitation,
    invitationExpired,
    hasErrors,
    navigateToCurrentStep,
    loaded,
    isLoadingDeny,
    isLoadingAccept,
    nextStep,
    acceptInvitation,
    denyInvitation,
    errorMessage,
  }
}
