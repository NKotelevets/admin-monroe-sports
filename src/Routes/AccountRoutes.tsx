import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import CreatePassword from '@/pages/Account/CreatePassword/CreatePassword.tsx'
import Invitations from '@/pages/Account/Invitations/Invitations.tsx'
import LogIn from '@/pages/Account/LogIn/LogIn.tsx'
import Onboarding from '@/pages/Account/Onboarding/Oboarding.tsx'
import RequestPasswordReset from '@/pages/Account/RequestPasswordReset/RequestPasswordReset.tsx'
import ResetPassword from '@/pages/Account/ResetPassword/ResetPassword.tsx'
import SignUp from '@/pages/Account/SignUp/SignUp.tsx'

import InfoAlert from '@/components/InfoAlert.tsx'
import Notification from '@/components/Notification.tsx'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

import AuthProvider from '@/utils/AuthProvider.tsx'

import {
  PATH_TO_ACCOUNT_INVITATIONS,
  PATH_TO_ACCOUNT_INVITATION_ERROR,
  PATH_TO_ACCOUNT_INVITATION_EXPIRED,
  PATH_TO_ACCOUNT_INVITE_PARENT,
  PATH_TO_ACCOUNT_LOGIN,
  PATH_TO_ACCOUNT_ONBOARDING,
  PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA,
  PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PARENT_DATA,
  PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD,
  PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD,
  PATH_TO_ACCOUNT_RESET_PASSWORD,
  PATH_TO_ACCOUNT_SIGNUP,
} from '@/common/constants/paths.ts'

/**
 * Functional component routing the account-related pages.

 * Paths are normalized using utility functions to ensure consistent URL structure.
 * Renders specific components for each defined route.
 *
 * @constant {Function} AccountRoutes - Component managing account-related routing.
 */
export const AccountRoutes = () => {
  const navigate = useNavigate()

  const { status, receiveInvitation, setError, setExpired } = useAccountSlice()
  const { access, refresh } = useAuthSlice()
  const { user } = useUserSlice()
  const { userData, invitation, invitationExpired, hasErrors, acceptedString, token } = useInvitation()

  let redirect = PATH_TO_ACCOUNT_INVITATIONS

  if (access && refresh && user) {
    if (user.invitations.length) {
      redirect = `${PATH_TO_ACCOUNT_INVITATIONS}/${user.invitations[0].id}`
    }
  }

  useEffect(() => {
    if (hasErrors) setError()
    if (invitationExpired) setExpired()

    if (!userData || !invitation || !token) return

    receiveInvitation({
      userData,
      invitation,
      token,
    })
  }, [userData, invitation, token])

  if (status === 'expired') {
    navigate(`${PATH_TO_ACCOUNT_INVITATION_EXPIRED}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'error') {
    navigate(`${PATH_TO_ACCOUNT_INVITATION_ERROR}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'createPassword') {
    navigate(`${PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'confirmData') {
    navigate(`${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'confirmParentData') {
    navigate(`${PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PARENT_DATA}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'pending' || status === 'requestLogin') {
    navigate(`/accounts/login?prev=${PATH_TO_ACCOUNT_INVITATIONS}/${token}/${acceptedString}`, { replace: true })
  }

  if (status === 'under16') {
    // TODO: check if token is needed at this point
    navigate(`${PATH_TO_ACCOUNT_INVITE_PARENT}/${token}/${acceptedString}`, { replace: true })
  }

  return (
    <AuthProvider defaultRedirect={redirect}>
      <Notification />
      <InfoAlert />

      <Routes>
        <Route path={normalizePath(PATH_TO_ACCOUNT_LOGIN)} element={<LogIn />} />
        <Route path={normalizePath(PATH_TO_ACCOUNT_SIGNUP)} element={<SignUp />} />
        <Route path={normalizePath(PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD)} element={<RequestPasswordReset />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_RESET_PASSWORD)}/:token`} element={<ResetPassword />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_ONBOARDING)}/:token`} element={<Onboarding />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_ONBOARDING)}/:token/:accepted`} element={<Onboarding />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD)}`} element={<CreatePassword />} />
        <Route
          path={`${normalizePath(PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD)}/:token`}
          element={<CreatePassword />}
        />
        <Route
          path={`${normalizePath(PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD)}/:token/:accepted`}
          element={<CreatePassword />}
        />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}`} element={<Invitations />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}/:token/:accepted`} element={<Invitations />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}/:token`} element={<Invitations />} />
      </Routes>
    </AuthProvider>
  )
}

const normalizePath = (path: string) => path.replace('/accounts', '')
