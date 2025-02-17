import { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'



import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useLazyGetUserQuery } from '@/redux/user/user.api'



import { useCookies } from '@/hooks/useCookies'
import { useLogout } from '@/hooks/useLogout'



import { AUTH_PAGES, PATH_TO_HOME, PATH_TO_LEAGUES, PATH_TO_SIGN_IN, PROTECTED_PAGES } from '@/common/constants/paths'


interface TAuthProviderProps {
  children: ReactNode
  defaultRedirect?: string
}

/**
 * AuthProvider is a functional component responsible for managing authentication states and
 * access tokens, handling user redirection, and ensuring appropriate access to protected routes.
 *
 * @param {TAuthProviderProps} props - Props passed to the AuthProvider component.
 * @property {React.ReactNode} children - The child components to render within the provider.
 * @property {string} [defaultRedirect=PATH_TO_LEAGUES] - Default path to redirect authenticated users.
 */
const AuthProvider = (props: TAuthProviderProps): ReactElement => {
  const { children, defaultRedirect = PATH_TO_LEAGUES } = props

  const { onLogOut } = useLogout()
  const { cookies, createCookie } = useCookies()
  const { access, refresh, isUpdatedTokens, setIsUpdatedTokens, redirectToLogin, updateTokens } = useAuthSlice()

  const navigate = useNavigate()
  const location = useLocation()
  const isProtectedPage = PROTECTED_PAGES.some(path => location.pathname.startsWith(path))

  const [getUserData] = useLazyGetUserQuery()
  const [searchParams] = useSearchParams()
  const prevRoute = searchParams.get('prev')

  /**
   * Logs the user out and redirects them to the login page if the "redirectToLogin" flag is true.
   */
  useEffect(() => {
    if (redirectToLogin) {
      onLogOut()
    }
  }, [redirectToLogin])

  /**
   * Updates authentication tokens by creating cookies for access and refresh tokens
   * if the tokens are updated and access is available. Resets the update flag after
   * creating the cookies.
   */
  useEffect(() => {
    if (isUpdatedTokens && access) {
      createCookie(`accessToken`, access)
      createCookie(`refreshToken`, refresh)
      setIsUpdatedTokens(false)
    }
  }, [isUpdatedTokens])

  /**
   * Handles authentication and navigation logic based on the current state of cookies, user authentication,
   * and the current route.
   *
   * - Updates tokens if an access token is found in cookies.
   * - Fetches user data after updating tokens.
   * - Redirects to the leagues page if the current path is the home page and access token exists.
   * - Redirects to the sign-in page if the current path is the home page and no access token exists.
   * - Redirects authenticated users on certain pages to a previous route or default route.
   * - Logs out and redirects if accessing a protected page without authentication.
   */
  useEffect(() => {
    if (cookies.accessToken) {
      updateTokens({
        access: cookies.accessToken,
        refresh: cookies.refreshToken,
      })

      getUserData()
    }

    if (location.pathname === PATH_TO_HOME && cookies.accessToken) navigate(PATH_TO_LEAGUES)

    if (location.pathname === PATH_TO_HOME && !cookies.accessToken) navigate(PATH_TO_SIGN_IN)

    if (cookies.accessToken && AUTH_PAGES.includes(location.pathname)) {
      if (prevRoute) {
        navigate(prevRoute)
      } else {
        navigate(defaultRedirect)
      }
    }

    if (!cookies.accessToken && isProtectedPage) {
      onLogOut()
    }
  }, [cookies.accessToken])

  return <>{children}</>
}

export default AuthProvider
