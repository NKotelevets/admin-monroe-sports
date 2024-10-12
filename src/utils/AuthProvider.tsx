import { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useLazyGetUserQuery } from '@/redux/user/user.api'

import { useCookies } from '@/hooks/useCookies'
import { useLogout } from '@/hooks/useLogout'

import { AUTH_PAGES, PATH_TO_LEAGUES, PATH_TO_SIGN_IN, PROTECTED_PAGES } from '@/common/constants/paths'

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { access, refresh, isUpdatedTokens, setIsUpdatedTokens, redirectToLogin, updateTokens } = useAuthSlice()
  const location = useLocation()
  const isProtectedPage = PROTECTED_PAGES.includes(location.pathname)
  const { onLogOut } = useLogout()
  const { cookies, createCookie } = useCookies()
  const [searchParams] = useSearchParams()
  const prevRoute = searchParams.get('prev')
  const [getUserData] = useLazyGetUserQuery()

  useEffect(() => {
    if (redirectToLogin) {
      onLogOut()
    }
  }, [redirectToLogin])

  useEffect(() => {
    if (isUpdatedTokens && access) {
      createCookie('accessToken', access)
      createCookie('refreshToken', refresh)
      setIsUpdatedTokens(false)
    }
  }, [isUpdatedTokens])

  useEffect(() => {
    if (cookies.accessToken) {
      updateTokens({
        access: cookies.accessToken,
        refresh: cookies.refreshToken,
      })

      getUserData()
    }

    if (location.pathname === '/' && cookies.accessToken) navigate(PATH_TO_LEAGUES)

    if (location.pathname === '/' && !cookies.accessToken) navigate(PATH_TO_SIGN_IN)

    if (cookies.accessToken && AUTH_PAGES.includes(location.pathname)) {
      if (prevRoute) {
        navigate(prevRoute)
      } else {
        navigate(PATH_TO_LEAGUES)
      }
    }

    if (!cookies.accessToken && isProtectedPage) {
      onLogOut()
    }
  }, [cookies.accessToken])

  return <>{children}</>
}

export default AuthProvider
