import { useLocation, useNavigate } from 'react-router-dom'

import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useCookies } from '@/hooks/useCookies'

import { PATH_TO_ACCOUNT_LOGIN, PATH_TO_SIGN_IN } from '@/common/constants/paths'

/**
 * useLogout is a custom hook designed to handle the user logout process.
 * It manages token removal, cookie deletion, user state clearing,
 * and redirects the user to an appropriate login page.
 *
 * @function
 * @returns {{onLogOut: function}} - An object containing the onLogOut function to execute the logout process.
 */
export const useLogout = () => {
  const { setRedirectToLogin, removeTokens } = useAuthSlice()
  const { deleteCookie } = useCookies()
  const location = useLocation()
  const navigate = useNavigate()
  const { clearUserData } = useUserSlice()

  /**
   * Handles user logout functionality by performing the following actions:
   * - Determines the appropriate redirect URL based on the current path.
   * - Removes authentication tokens stored locally.
   * - Deletes authentication-related cookies.
   * - Resets any login redirection flags.
   * - Navigates to the login page with the previous path as a query parameter.
   * - Clears user-specific data from the application state.
   */
  const onLogOut = (redirect?: boolean | undefined) => {
    const url = location.pathname.includes('account') ? PATH_TO_ACCOUNT_LOGIN : PATH_TO_SIGN_IN

    removeTokens()
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    setRedirectToLogin(false)
    if (redirect !== false) {
      navigate(url + `?prev=${location.pathname}`)
    }
    clearUserData()
  }

  return { onLogOut }
}
