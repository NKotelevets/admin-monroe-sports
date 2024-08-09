import { useLocation, useNavigate } from 'react-router-dom'

import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useCookies } from '@/hooks/useCookies'

import { PATH_TO_SIGN_IN } from '@/constants/paths'

export const useLogout = () => {
  const { setRedirectToLogin, removeTokens } = useAuthSlice()
  const { deleteCookie } = useCookies()
  const location = useLocation()
  const navigate = useNavigate()
  const { clearUserData } = useUserSlice()

  const onLogOut = () => {
    removeTokens()
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    setRedirectToLogin(false)
    navigate(PATH_TO_SIGN_IN + `?prev=${location.pathname}`)
    clearUserData()
  }

  return { onLogOut }
}
