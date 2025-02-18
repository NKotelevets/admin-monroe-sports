import { Route, Routes } from 'react-router-dom'

import Invitations from '@/pages/Account/Invitations/Invitations.tsx'
import LogIn from '@/pages/Account/LogIn/LogIn.tsx'
import RequestPasswordReset from '@/pages/Account/RequestPasswordReset/RequestPasswordReset.tsx'
import ResetPassword from '@/pages/Account/ResetPassword/ResetPassword.tsx'
import SignUp from '@/pages/Account/SignUp/SignUp.tsx'

import InfoAlert from '@/components/InfoAlert.tsx'
import Notification from '@/components/Notification.tsx'

import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import AuthProvider from '@/utils/AuthProvider.tsx'

import {
  PATH_TO_ACCOUNT_INVITATIONS,
  PATH_TO_ACCOUNT_LOGIN,
  PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD,
  PATH_TO_ACCOUNT_RESET_PASSWORD,
  PATH_TO_ACCOUNT_SIGNUP
} from '@/common/constants/paths.ts'

/**
 * Functional component routing the account-related pages.

 * Paths are normalized using utility functions to ensure consistent URL structure.
 * Renders specific components for each defined route.
 *
 * @constant {Function} AccountRoutes - Component managing account-related routing.
 */
export const AccountRoutes = () => {
  const { access, refresh } = useAuthSlice()
  const { user } = useUserSlice()

  let redirect = PATH_TO_ACCOUNT_INVITATIONS

  if (access && refresh && user) {
    if (user.invitations.length) {
      redirect = `${PATH_TO_ACCOUNT_INVITATIONS}/${user.invitations[0].id}`
    }
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
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}`} element={<Invitations />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}/:token/:accepted`} element={<Invitations />} />
        <Route path={`${normalizePath(PATH_TO_ACCOUNT_INVITATIONS)}/:token`} element={<Invitations />} />
      </Routes>
    </AuthProvider>
  )
}

const normalizePath = (path: string) => path.replace('/accounts', '')
